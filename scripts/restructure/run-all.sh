#!/bin/bash

# 项目重构主执行脚本
# 可以按阶段执行所有重构脚本

echo "🚀 项目目录结构重构工具"
echo "================================"

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录下运行此脚本"
    exit 1
fi

# 显示菜单
show_menu() {
    echo ""
    echo "请选择要执行的阶段："
    echo "1) 第一阶段：文档整理"
    echo "2) 第二阶段：数据文件整理"
    echo "3) 第三阶段：源代码重构"
    echo "4) 第四阶段：页面和组件整理"
    echo "5) 第五阶段：配置和工具整理"
    echo "6) 执行所有阶段"
    echo "7) 退出"
    echo ""
    read -p "请输入选择 (1-7): " choice
}

# 执行第一阶段
run_stage1() {
    echo "📋 执行第一阶段：文档整理"
    echo "================================"
    ./scripts/restructure/01-docs-reorganize.sh
    echo ""
    echo "✅ 第一阶段完成！"
}

# 执行第二阶段
run_stage2() {
    echo "📊 执行第二阶段：数据文件整理"
    echo "================================"
    ./scripts/restructure/02-data-reorganize.sh
    echo ""
    echo "✅ 第二阶段完成！"
}

# 执行第三阶段
run_stage3() {
    echo "🔧 执行第三阶段：源代码重构"
    echo "================================"
    ./scripts/restructure/03-code-restructure.sh
    echo ""
    echo "✅ 第三阶段完成！"
}

# 执行第四阶段
run_stage4() {
    echo "📄 执行第四阶段：页面和组件整理"
    echo "================================"
    ./scripts/restructure/04-pages-reorganize.sh
    echo ""
    echo "✅ 第四阶段完成！"
}

# 执行第五阶段
run_stage5() {
    echo "⚙️  执行第五阶段：配置和工具整理"
    echo "================================"
    ./scripts/restructure/05-config-reorganize.sh
    echo ""
    echo "✅ 第五阶段完成！"
}

# 执行所有阶段
run_all_stages() {
    echo "🚀 执行所有重构阶段"
    echo "================================"
    
    echo "⚠️  警告：这将执行所有重构阶段，请确保已备份项目！"
    read -p "确认继续？(y/N): " confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        run_stage1
        run_stage2
        run_stage3
        run_stage4
        run_stage5
        
        echo ""
        echo "🎉 所有阶段执行完成！"
        echo "📋 请查看 项目整理TODO清单.md 了解后续步骤"
    else
        echo "❌ 已取消执行"
    fi
}

# 验证脚本
validate_scripts() {
    echo "🔍 验证重构脚本..."
    
    scripts=(
        "scripts/restructure/01-docs-reorganize.sh"
        "scripts/restructure/02-data-reorganize.sh"
        "scripts/restructure/03-code-restructure.sh"
        "scripts/restructure/04-pages-reorganize.sh"
        "scripts/restructure/05-config-reorganize.sh"
    )
    
    for script in "${scripts[@]}"; do
        if [ -f "$script" ]; then
            echo "✅ $script"
        else
            echo "❌ $script (缺失)"
            return 1
        fi
    done
    
    echo "✅ 所有脚本验证通过"
    return 0
}

# 主循环
main() {
    echo "🔍 验证重构脚本..."
    if ! validate_scripts; then
        echo "❌ 脚本验证失败，请检查脚本文件"
        exit 1
    fi
    
    while true; do
        show_menu
        
        case $choice in
            1)
                run_stage1
                ;;
            2)
                run_stage2
                ;;
            3)
                run_stage3
                ;;
            4)
                run_stage4
                ;;
            5)
                run_stage5
                ;;
            6)
                run_all_stages
                ;;
            7)
                echo "👋 再见！"
                exit 0
                ;;
            *)
                echo "❌ 无效选择，请重新输入"
                ;;
        esac
        
        if [ "$choice" != "7" ]; then
            echo ""
            read -p "按回车键继续..."
        fi
    done
}

# 运行主函数
main
