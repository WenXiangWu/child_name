/**
 * 依赖图管理类
 * 负责处理插件间的依赖关系，检测循环依赖
 */

import { PluginDependency } from '../interfaces/NamingPlugin';

export interface DependencyNode {
  id: string;
  dependencies: PluginDependency[];
  dependents: string[];
}

export class DependencyGraph {
  private nodes: Map<string, DependencyNode> = new Map();
  private adjacencyList: Map<string, Set<string>> = new Map();

  /**
   * 添加插件节点
   */
  addNode(pluginId: string, dependencies: PluginDependency[]): void {
    // 创建节点
    const node: DependencyNode = {
      id: pluginId,
      dependencies,
      dependents: []
    };
    
    this.nodes.set(pluginId, node);
    this.adjacencyList.set(pluginId, new Set());
    
    // 建立依赖关系
    for (const dep of dependencies) {
      if (dep.required) {
        this.addEdge(dep.pluginId, pluginId);
      }
    }
  }

  /**
   * 移除插件节点
   */
  removeNode(pluginId: string): void {
    // 移除所有指向此节点的边
    for (const [from, edges] of this.adjacencyList) {
      edges.delete(pluginId);
    }
    
    // 移除节点
    this.nodes.delete(pluginId);
    this.adjacencyList.delete(pluginId);
  }

  /**
   * 添加依赖边
   */
  private addEdge(from: string, to: string): void {
    if (!this.adjacencyList.has(from)) {
      this.adjacencyList.set(from, new Set());
    }
    this.adjacencyList.get(from)!.add(to);
    
    // 更新依赖者的依赖列表
    const fromNode = this.nodes.get(from);
    if (fromNode) {
      fromNode.dependents.push(to);
    }
  }

  /**
   * 检查是否存在循环依赖
   */
  hasCircularDependency(): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        if (this.hasCyclesDFS(nodeId, visited, recursionStack)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * 深度优先搜索检测循环依赖
   */
  private hasCyclesDFS(
    nodeId: string, 
    visited: Set<string>, 
    recursionStack: Set<string>
  ): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    
    // 检查当前节点的所有依赖
    const node = this.nodes.get(nodeId);
    if (node) {
      for (const dep of node.dependencies) {
        if (dep.required) {
          const depId = dep.pluginId;
          if (!visited.has(depId)) {
            if (this.hasCyclesDFS(depId, visited, recursionStack)) {
              return true;
            }
          } else if (recursionStack.has(depId)) {
            return true;
          }
        }
      }
    }
    
    recursionStack.delete(nodeId);
    return false;
  }

  /**
   * 获取拓扑排序的执行顺序
   */
  getTopologicalOrder(): string[] {
    if (this.hasCircularDependency()) {
      throw new Error('检测到循环依赖');
    }
    
    const allPluginIds = Array.from(this.nodes.keys());
    return this.topologicalSort(allPluginIds);
  }

  /**
   * 获取拓扑排序的执行顺序 (带参数版本)
   */
  topologicalSort(enabledPluginIds: string[]): string[] {
    const result: string[] = [];
    const visited = new Set<string>();
    const temp = new Set<string>();
    
    for (const pluginId of enabledPluginIds) {
      if (!visited.has(pluginId)) {
        this.topologicalSortDFS(pluginId, visited, temp, result, enabledPluginIds);
      }
    }
    
    return result.reverse();
  }

  /**
   * 深度优先搜索进行拓扑排序
   */
  private topologicalSortDFS(
    nodeId: string,
    visited: Set<string>,
    temp: Set<string>,
    result: string[],
    enabledPluginIds: string[]
  ): void {
    if (temp.has(nodeId)) {
      throw new Error(`循环依赖检测到: ${nodeId}`);
    }
    
    if (visited.has(nodeId)) {
      return;
    }
    
    temp.add(nodeId);
    
    const edges = this.adjacencyList.get(nodeId) || new Set();
    for (const neighbor of edges) {
      if (enabledPluginIds.includes(neighbor)) {
        this.topologicalSortDFS(neighbor, visited, temp, result, enabledPluginIds);
      }
    }
    
    temp.delete(nodeId);
    visited.add(nodeId);
    result.push(nodeId);
  }

  /**
   * 获取依赖此插件的其他插件
   */
  getDependents(pluginId: string): string[] {
    const node = this.nodes.get(pluginId);
    return node ? [...node.dependents] : [];
  }

  /**
   * 获取插件的所有依赖
   */
  getDependencies(pluginId: string): PluginDependency[] {
    const node = this.nodes.get(pluginId);
    return node ? [...node.dependencies] : [];
  }

  /**
   * 检查依赖是否满足
   */
  checkDependencies(pluginId: string, availablePlugins: Set<string>): {
    satisfied: boolean;
    missing: string[];
    available: string[];
  } {
    const node = this.nodes.get(pluginId);
    if (!node) {
      return { satisfied: false, missing: [pluginId], available: [] };
    }
    
    const missing: string[] = [];
    const satisfied: string[] = [];
    
    for (const dep of node.dependencies) {
      if (dep.required && !availablePlugins.has(dep.pluginId)) {
        missing.push(dep.pluginId);
      } else if (availablePlugins.has(dep.pluginId)) {
        satisfied.push(dep.pluginId);
      }
    }
    
    return {
      satisfied: missing.length === 0,
      missing,
      available: satisfied
    };
  }

  /**
   * 获取依赖图的可视化表示
   */
  getVisualization(): string {
    let result = 'Dependency Graph:\n';
    
    for (const [pluginId, node] of this.nodes) {
      result += `\n${pluginId}:\n`;
      if (node.dependencies.length > 0) {
        result += `  Dependencies: ${node.dependencies.map(d => d.pluginId).join(', ')}\n`;
      }
      if (node.dependents.length > 0) {
        result += `  Dependents: ${node.dependents.join(', ')}\n`;
      }
    }
    
    return result;
  }

  /**
   * 清空依赖图
   */
  clear(): void {
    this.nodes.clear();
    this.adjacencyList.clear();
  }

  /**
   * 获取依赖图状态信息
   */
  getStatus(): {
    totalNodes: number;
    totalEdges: number;
    hasCircularDependency: boolean;
  } {
    let totalEdges = 0;
    
    for (const edges of this.adjacencyList.values()) {
      totalEdges += edges.size;
    }
    
    return {
      totalNodes: this.nodes.size,
      totalEdges,
      hasCircularDependency: this.hasCircularDependency()
    };
  }

  /**
   * 获取依赖图统计信息
   */
  getStats(): {
    totalNodes: number;
    totalEdges: number;
    maxDepth: number;
    isolatedNodes: number;
  } {
    let totalEdges = 0;
    let isolatedNodes = 0;
    
    for (const edges of this.adjacencyList.values()) {
      totalEdges += edges.size;
    }
    
    for (const node of this.nodes.values()) {
      if (node.dependencies.length === 0 && node.dependents.length === 0) {
        isolatedNodes++;
      }
    }
    
    return {
      totalNodes: this.nodes.size,
      totalEdges,
      maxDepth: this.calculateMaxDepth(),
      isolatedNodes
    };
  }

  /**
   * 计算最大依赖深度
   */
  private calculateMaxDepth(): number {
    let maxDepth = 0;
    
    for (const nodeId of this.nodes.keys()) {
      const depth = this.calculateNodeDepth(nodeId, new Set<string>());
      maxDepth = Math.max(maxDepth, depth);
    }
    
    return maxDepth;
  }

  /**
   * 计算单个节点的依赖深度
   */
  private calculateNodeDepth(nodeId: string, visited: Set<string>): number {
    if (visited.has(nodeId)) {
      return 0;
    }
    
    visited.add(nodeId);
    const node = this.nodes.get(nodeId);
    if (!node || node.dependencies.length === 0) {
      return 0;
    }
    
    let maxDepth = 0;
    for (const dep of node.dependencies) {
      if (dep.required) {
        const depth = this.calculateNodeDepth(dep.pluginId, visited);
        maxDepth = Math.max(maxDepth, depth);
      }
    }
    
    return maxDepth + 1;
  }
}
