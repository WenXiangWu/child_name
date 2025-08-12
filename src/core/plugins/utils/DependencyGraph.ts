/**
 * 依赖图管理器 - 管理插件间的依赖关系和执行顺序
 */

import { PluginDependency } from '../interfaces/NamingPlugin';

export interface DependencyNode {
  id: string;
  dependencies: PluginDependency[];
  dependents: string[];
  layer: number;
  visited: boolean;
  inStack: boolean;
}

export class DependencyGraph {
  private nodes: Map<string, DependencyNode> = new Map();
  private adjacencyList: Map<string, string[]> = new Map();

  /**
   * 添加节点
   */
  addNode(pluginId: string, dependencies: PluginDependency[], layer: number = 0): void {
    const node: DependencyNode = {
      id: pluginId,
      dependencies,
      dependents: [],
      layer,
      visited: false,
      inStack: false
    };

    this.nodes.set(pluginId, node);
    this.adjacencyList.set(pluginId, dependencies.map(dep => dep.pluginId));

    // 更新被依赖节点的依赖者列表
    dependencies.forEach(dep => {
      const depNode = this.nodes.get(dep.pluginId);
      if (depNode && !depNode.dependents.includes(pluginId)) {
        depNode.dependents.push(pluginId);
      }
    });
  }

  /**
   * 移除节点
   */
  removeNode(pluginId: string): void {
    const node = this.nodes.get(pluginId);
    if (!node) return;

    // 移除依赖关系
    node.dependencies.forEach(dep => {
      const depNode = this.nodes.get(dep.pluginId);
      if (depNode) {
        depNode.dependents = depNode.dependents.filter(id => id !== pluginId);
      }
    });

    // 移除被依赖关系
    node.dependents.forEach(dependentId => {
      const dependentNode = this.nodes.get(dependentId);
      if (dependentNode) {
        dependentNode.dependencies = dependentNode.dependencies.filter(
          dep => dep.pluginId !== pluginId
        );
        const adjacentList = this.adjacencyList.get(dependentId);
        if (adjacentList) {
          this.adjacencyList.set(
            dependentId, 
            adjacentList.filter(id => id !== pluginId)
          );
        }
      }
    });

    this.nodes.delete(pluginId);
    this.adjacencyList.delete(pluginId);
  }

  /**
   * 检查是否存在循环依赖
   */
  hasCycles(): boolean {
    // 重置访问状态
    this.nodes.forEach(node => {
      node.visited = false;
      node.inStack = false;
    });

    // 对每个未访问的节点进行深度优先搜索
    for (const [nodeId] of this.nodes) {
      const node = this.nodes.get(nodeId)!;
      if (!node.visited) {
        if (this.hasCycleDFS(nodeId)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 深度优先搜索检测循环
   */
  private hasCycleDFS(nodeId: string): boolean {
    const node = this.nodes.get(nodeId);
    if (!node) return false;

    node.visited = true;
    node.inStack = true;

    const dependencies = this.adjacencyList.get(nodeId) || [];
    for (const depId of dependencies) {
      const depNode = this.nodes.get(depId);
      if (!depNode) continue;

      if (!depNode.visited) {
        if (this.hasCycleDFS(depId)) {
          return true;
        }
      } else if (depNode.inStack) {
        return true; // 发现循环
      }
    }

    node.inStack = false;
    return false;
  }

  /**
   * 拓扑排序 - 获取正确的执行顺序
   */
  topologicalSort(enabledPlugins?: string[]): string[] {
    const result: string[] = [];
    const visited = new Set<string>();
    const temp = new Set<string>();

    const pluginsToSort = enabledPlugins || Array.from(this.nodes.keys());

    // 深度优先搜索进行拓扑排序
    const dfs = (nodeId: string): boolean => {
      if (temp.has(nodeId)) {
        throw new Error(`循环依赖检测到，涉及插件: ${nodeId}`);
      }
      if (visited.has(nodeId)) {
        return true;
      }

      temp.add(nodeId);
      
      const dependencies = this.adjacencyList.get(nodeId) || [];
      for (const depId of dependencies) {
        // 只处理启用的插件
        if (pluginsToSort.includes(depId)) {
          dfs(depId);
        }
      }

      temp.delete(nodeId);
      visited.add(nodeId);
      result.push(nodeId);
      return true;
    };

    // 对每个启用的插件进行排序
    for (const pluginId of pluginsToSort) {
      if (!visited.has(pluginId)) {
        dfs(pluginId);
      }
    }

    return result.reverse(); // 反转以获得正确的依赖顺序
  }

  /**
   * 按层级排序 - 获取分层执行顺序
   */
  topologicalSortByLayers(enabledPlugins?: string[]): string[][] {
    const sortedOrder = this.topologicalSort(enabledPlugins);
    const layers: Map<number, string[]> = new Map();

    // 按层级分组
    sortedOrder.forEach(pluginId => {
      const node = this.nodes.get(pluginId);
      if (node) {
        const layer = node.layer;
        if (!layers.has(layer)) {
          layers.set(layer, []);
        }
        layers.get(layer)!.push(pluginId);
      }
    });

    // 转换为数组，按层级顺序
    const layerKeys = Array.from(layers.keys()).sort((a, b) => a - b);
    return layerKeys.map(layer => layers.get(layer) || []);
  }

  /**
   * 获取节点的依赖者
   */
  getDependents(pluginId: string): string[] {
    const node = this.nodes.get(pluginId);
    return node ? [...node.dependents] : [];
  }

  /**
   * 获取节点的依赖项
   */
  getDependencies(pluginId: string): PluginDependency[] {
    const node = this.nodes.get(pluginId);
    return node ? [...node.dependencies] : [];
  }

  /**
   * 检查插件是否可以被移除
   */
  canRemove(pluginId: string): { canRemove: boolean; blockedBy: string[] } {
    const dependents = this.getDependents(pluginId);
    const requiredDependents = dependents.filter(dependentId => {
      const dependentNode = this.nodes.get(dependentId);
      if (!dependentNode) return false;
      
      return dependentNode.dependencies.some(
        dep => dep.pluginId === pluginId && dep.required
      );
    });

    return {
      canRemove: requiredDependents.length === 0,
      blockedBy: requiredDependents
    };
  }

  /**
   * 获取可以并行执行的插件组
   */
  getParallelGroups(enabledPlugins?: string[]): string[][] {
    const layeredOrder = this.topologicalSortByLayers(enabledPlugins);
    const parallelGroups: string[][] = [];

    layeredOrder.forEach(layer => {
      if (layer.length === 0) return;

      // 在同一层级内，检查是否有相互依赖
      const groups: string[][] = [];
      const processed = new Set<string>();

      layer.forEach(pluginId => {
        if (processed.has(pluginId)) return;

        const group = [pluginId];
        processed.add(pluginId);

        // 查找可以与当前插件并行执行的其他插件
        layer.forEach(otherPluginId => {
          if (processed.has(otherPluginId)) return;
          if (!this.hasDirectDependency(pluginId, otherPluginId) &&
              !this.hasDirectDependency(otherPluginId, pluginId)) {
            group.push(otherPluginId);
            processed.add(otherPluginId);
          }
        });

        groups.push(group);
      });

      parallelGroups.push(...groups);
    });

    return parallelGroups;
  }

  /**
   * 检查两个插件之间是否有直接依赖关系
   */
  private hasDirectDependency(from: string, to: string): boolean {
    const dependencies = this.adjacencyList.get(from) || [];
    return dependencies.includes(to);
  }

  /**
   * 验证依赖的完整性
   */
  validateDependencies(enabledPlugins: string[]): {
    valid: boolean;
    missingDependencies: Array<{ pluginId: string; missingDep: string; required: boolean }>;
    circularDependencies: string[];
  } {
    const missingDependencies: Array<{ pluginId: string; missingDep: string; required: boolean }> = [];
    const circularDependencies: string[] = [];

    // 检查缺失的依赖
    enabledPlugins.forEach(pluginId => {
      const node = this.nodes.get(pluginId);
      if (!node) return;

      node.dependencies.forEach(dep => {
        if (!enabledPlugins.includes(dep.pluginId)) {
          missingDependencies.push({
            pluginId,
            missingDep: dep.pluginId,
            required: dep.required
          });
        }
      });
    });

    // 检查循环依赖
    if (this.hasCycles()) {
      // 找出涉及循环的插件
      const visited = new Set<string>();
      const inStack = new Set<string>();

      const findCycle = (nodeId: string, path: string[]): void => {
        if (inStack.has(nodeId)) {
          const cycleStart = path.indexOf(nodeId);
          const cycle = path.slice(cycleStart);
          circularDependencies.push(...cycle);
          return;
        }
        if (visited.has(nodeId)) return;

        visited.add(nodeId);
        inStack.add(nodeId);

        const dependencies = this.adjacencyList.get(nodeId) || [];
        dependencies.forEach(depId => {
          if (enabledPlugins.includes(depId)) {
            findCycle(depId, [...path, nodeId]);
          }
        });

        inStack.delete(nodeId);
      };

      enabledPlugins.forEach(pluginId => {
        if (!visited.has(pluginId)) {
          findCycle(pluginId, []);
        }
      });
    }

    return {
      valid: missingDependencies.length === 0 && circularDependencies.length === 0,
      missingDependencies,
      circularDependencies: [...new Set(circularDependencies)]
    };
  }

  /**
   * 获取图的统计信息
   */
  getStatistics(): {
    totalNodes: number;
    totalEdges: number;
    averageDependencies: number;
    maxDependencies: number;
    layerDistribution: Map<number, number>;
  } {
    const totalNodes = this.nodes.size;
    let totalEdges = 0;
    let maxDependencies = 0;
    const layerDistribution = new Map<number, number>();

    this.nodes.forEach(node => {
      const depCount = node.dependencies.length;
      totalEdges += depCount;
      maxDependencies = Math.max(maxDependencies, depCount);

      const layer = node.layer;
      layerDistribution.set(layer, (layerDistribution.get(layer) || 0) + 1);
    });

    return {
      totalNodes,
      totalEdges,
      averageDependencies: totalNodes > 0 ? totalEdges / totalNodes : 0,
      maxDependencies,
      layerDistribution
    };
  }

  /**
   * 清空图
   */
  clear(): void {
    this.nodes.clear();
    this.adjacencyList.clear();
  }

  /**
   * 获取所有节点
   */
  getAllNodes(): DependencyNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * 导出图结构用于调试
   */
  exportGraph(): {
    nodes: Array<{ id: string; layer: number; dependencies: string[] }>;
    edges: Array<{ from: string; to: string; required: boolean }>;
  } {
    const nodes: Array<{ id: string; layer: number; dependencies: string[] }> = [];
    const edges: Array<{ from: string; to: string; required: boolean }> = [];

    this.nodes.forEach(node => {
      nodes.push({
        id: node.id,
        layer: node.layer,
        dependencies: node.dependencies.map(dep => dep.pluginId)
      });

      node.dependencies.forEach(dep => {
        edges.push({
          from: dep.pluginId,
          to: node.id,
          required: dep.required
        });
      });
    });

    return { nodes, edges };
  }
}
