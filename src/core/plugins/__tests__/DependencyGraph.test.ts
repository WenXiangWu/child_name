/**
 * 依赖图管理类测试
 */

import { DependencyGraph } from '../core/DependencyGraph';
import { PluginDependency } from '../interfaces/NamingPlugin';

describe('DependencyGraph', () => {
  let graph: DependencyGraph;

  beforeEach(() => {
    graph = new DependencyGraph();
  });

  describe('addNode', () => {
    it('应该正确添加节点', () => {
      const dependencies: PluginDependency[] = [
        { pluginId: 'plugin-a', required: true },
        { pluginId: 'plugin-b', required: false }
      ];

      graph.addNode('test-plugin', dependencies);
      const status = graph.getStatus();

      expect(status.totalNodes).toBe(1);
      expect(status.totalEdges).toBe(1); // 只有必需的依赖会创建边
    });

    it('应该处理空依赖列表', () => {
      graph.addNode('test-plugin', []);
      const status = graph.getStatus();

      expect(status.totalNodes).toBe(1);
      expect(status.totalEdges).toBe(0);
    });
  });

  describe('removeNode', () => {
    it('应该正确移除节点', () => {
      graph.addNode('plugin-1', []);
      graph.addNode('plugin-2', [{ pluginId: 'plugin-1', required: true }]);

      graph.removeNode('plugin-1');
      const status = graph.getStatus();

      expect(status.totalNodes).toBe(1);
      expect(status.totalEdges).toBe(0);
    });

    it('应该移除不存在的节点而不报错', () => {
      expect(() => graph.removeNode('non-existent')).not.toThrow();
    });
  });

  describe('hasCircularDependency', () => {
    it('应该检测到循环依赖', () => {
      graph.addNode('plugin-a', [{ pluginId: 'plugin-b', required: true }]);
      graph.addNode('plugin-b', [{ pluginId: 'plugin-c', required: true }]);
      graph.addNode('plugin-c', [{ pluginId: 'plugin-a', required: true }]);

      expect(graph.hasCircularDependency()).toBe(true);
    });

    it('应该检测到自循环依赖', () => {
      graph.addNode('plugin-a', [{ pluginId: 'plugin-a', required: true }]);

      expect(graph.hasCircularDependency()).toBe(true);
    });

    it('应该正确识别无循环依赖', () => {
      graph.addNode('plugin-a', []);
      graph.addNode('plugin-b', [{ pluginId: 'plugin-a', required: true }]);
      graph.addNode('plugin-c', [{ pluginId: 'plugin-b', required: true }]);

      expect(graph.hasCircularDependency()).toBe(false);
    });
  });

  describe('getTopologicalOrder', () => {
    it('应该返回正确的拓扑排序', () => {
      graph.addNode('plugin-a', []);
      graph.addNode('plugin-b', [{ pluginId: 'plugin-a', required: true }]);
      graph.addNode('plugin-c', [{ pluginId: 'plugin-b', required: true }]);

      const order = graph.getTopologicalOrder();

      expect(order).toEqual(['plugin-a', 'plugin-b', 'plugin-c']);
    });

    it('应该处理无依赖的节点', () => {
      graph.addNode('plugin-a', []);
      graph.addNode('plugin-b', []);

      const order = graph.getTopologicalOrder();

      expect(order).toContain('plugin-a');
      expect(order).toContain('plugin-b');
      expect(order.length).toBe(2);
    });

    it('应该在有循环依赖时抛出错误', () => {
      graph.addNode('plugin-a', [{ pluginId: 'plugin-b', required: true }]);
      graph.addNode('plugin-b', [{ pluginId: 'plugin-a', required: true }]);

      expect(() => graph.getTopologicalOrder()).toThrow('检测到循环依赖');
    });
  });

  describe('getDependents', () => {
    it('应该返回正确的依赖者列表', () => {
      graph.addNode('plugin-a', []);
      graph.addNode('plugin-b', [{ pluginId: 'plugin-a', required: true }]);
      graph.addNode('plugin-c', [{ pluginId: 'plugin-a', required: true }]);

      const dependents = graph.getDependents('plugin-a');

      expect(dependents).toContain('plugin-b');
      expect(dependents).toContain('plugin-c');
      expect(dependents.length).toBe(2);
    });

    it('应该为空依赖者返回空数组', () => {
      graph.addNode('plugin-a', []);

      const dependents = graph.getDependents('plugin-a');

      expect(dependents).toEqual([]);
    });
  });

  describe('getStatus', () => {
    it('应该返回正确的状态信息', () => {
      graph.addNode('plugin-a', []);
      graph.addNode('plugin-b', [{ pluginId: 'plugin-a', required: true }]);

      const status = graph.getStatus();

      expect(status.totalNodes).toBe(2);
      expect(status.totalEdges).toBe(1);
      expect(status.hasCircularDependency).toBe(false);
    });
  });

  describe('复杂依赖场景', () => {
    it('应该处理复杂的依赖关系', () => {
      // 创建一个复杂的依赖图
      graph.addNode('base', []);
      graph.addNode('utils', [{ pluginId: 'base', required: true }]);
      graph.addNode('parser', [{ pluginId: 'utils', required: true }]);
      graph.addNode('validator', [{ pluginId: 'utils', required: true }]);
      graph.addNode('processor', [
        { pluginId: 'parser', required: true },
        { pluginId: 'validator', required: true }
      ]);

      const order = graph.getTopologicalOrder();
      const status = graph.getStatus();

      expect(status.totalNodes).toBe(5);
      expect(status.totalEdges).toBe(5);
      expect(status.hasCircularDependency).toBe(false);

      // 验证拓扑排序的正确性
      expect(order.indexOf('base')).toBeLessThan(order.indexOf('utils'));
      expect(order.indexOf('utils')).toBeLessThan(order.indexOf('parser'));
      expect(order.indexOf('utils')).toBeLessThan(order.indexOf('validator'));
      expect(order.indexOf('parser')).toBeLessThan(order.indexOf('processor'));
      expect(order.indexOf('validator')).toBeLessThan(order.indexOf('processor'));
    });
  });
});
