document.addEventListener('DOMContentLoaded', () => {
    // 1. 获取 DOM 元素
    const equationInput = document.getElementById('equation-input');
    const methodSelect = document.getElementById('method-select');
    const x0Input = document.getElementById('x0-input');
    const x1Input = document.getElementById('x1-input');
    const toleranceInput = document.getElementById('tolerance-input');
    const maxIterInput = document.getElementById('max-iter-input');
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const functionChartCanvas = document.getElementById('function-chart');
    const convergenceChartCanvas = document.getElementById('convergence-chart');
    const iterationsTableBody = document.querySelector('#iterations-table tbody');
    const finalResultDiv = document.getElementById('final-result');

    let functionChartInstance = null;
    let convergenceChartInstance = null;

    // 根据选择的方法显示/隐藏特定参数
    methodSelect.addEventListener('change', () => {
        if (methodSelect.value === 'secantDouble') {
            document.querySelectorAll('.for-secant').forEach(el => el.style.display = 'block');
        } else {
            document.querySelectorAll('.for-secant').forEach(el => el.style.display = 'none');
        }
    });
    
    // 2. 绑定事件监听器
    calculateBtn.addEventListener('click', calculateAndVisualize);
    clearBtn.addEventListener('click', clearAll);

    // 3. 核心逻辑函数
    function calculateAndVisualize() {
        // a. 读取并验证输入
        const equationStr = equationInput.value.trim();
        const method = methodSelect.value;
        const x0 = parseFloat(x0Input.value);
        const x1 = parseFloat(x1Input.value);
        const tolerance = parseFloat(toleranceInput.value);
        const maxIter = parseInt(maxIterInput.value);

        if (!equationStr || isNaN(x0) || isNaN(tolerance) || isNaN(maxIter)) {
            alert('请输入有效的参数！');
            return;
        }

        // b. 解析方程
        try {
            const f = parseEquation(equationStr); // 来自 parser.js
            const df = method === 'newton' || method === 'newtonDownhill' ? derivative(f, equationStr) : null; // 牛顿法需要导数

            // c. 根据选择的方法调用相应的算法
            let iterationsData;
            switch(method) {
                case 'newton':
                    iterationsData = newtonMethod(f, df, x0, tolerance, maxIter);
                    break;
                case 'newtonDownhill':
                    iterationsData = newtonDownhillMethod(f, df, x0, tolerance, maxIter);
                    break;
                case 'aitken':
                    // 埃特肯法需要一个基本的迭代公式 x = g(x)
                    // 这里可以让用户输入，或者从 f(x) = 0 变形得到，例如 g(x) = x - f(x)
                    // 为简化，假设 g(x) = x - f(x)
                    const g = (x) => x - f(x); 
                    iterationsData = aitkenMethod(g, x0, tolerance, maxIter);
                    break;
                case 'secantSingle':
                    iterationsData = secantSingleMethod(f, x0, tolerance, maxIter);
                    break;
                case 'secantDouble':
                    if (isNaN(x1)) { alert('双点弦截法需要两个初始值！'); return; }
                    iterationsData = secantDoubleMethod(f, x0, x1, tolerance, maxIter);
                    break;
                default:
                    alert('未知的迭代方法！');
                    return;
            }

            // d. 处理算法结果并可视化
            if (iterationsData.converged) {
                // 更新表格
                updateIterationsTable(iterationsData.history); // 来自 table.js
                
                // 更新最终结果
                finalResultDiv.innerHTML = `
                    <strong>计算成功！</strong><br>
                    方程 ${equationStr} = 0 的根为: x ≈ ${iterationsData.root.toFixed(10)}<br>
                    迭代次数: ${iterationsData.iterations}<br>
                    最终误差: |f(x)| ≈ ${Math.abs(f(iterationsData.root)).toExponential(6)}
                `;

                // 绘制图表
                const xValues = iterationsData.history.map(step => step.x);
                const yValues = xValues.map(x => f(x));
                
                // 定义函数绘图的范围，以迭代点为中心适当扩展
                const xMin = Math.min(...xValues) - 2;
                const xMax = Math.max(...xValues) + 2;
                
                functionChartInstance = plotFunctionAndPoints(functionChartCanvas, functionChartInstance, f, xMin, xMax, xValues, yValues, method); // 来自 plotter.js
                convergenceChartInstance = plotConvergence(convergenceChartCanvas, convergenceChartInstance, iterationsData.history); // 来自 plotter.js

            } else {
                finalResultDiv.innerHTML = `<strong style="color: red;">计算失败！</strong><br>${iterationsData.message}`;
                // 清空之前的图表
                if (functionChartInstance) functionChartInstance.destroy();
                if (convergenceChartInstance) convergenceChartInstance.destroy();
                iterationsTableBody.innerHTML = '';
            }

        } catch (error) {
            alert(`解析方程时出错: ${error.message}`);
            console.error(error);
        }
    }

    function clearAll() {
        equationInput.value = 'x^3 - x - 1';
        methodSelect.value = 'newton';
        x0Input.value = '1.5';
        x1Input.value = '1.6';
        toleranceInput.value = '0.000001';
        maxIterInput.value = '50';
        iterationsTableBody.innerHTML = '';
        finalResultDiv.innerHTML = '';

        if (functionChartInstance) {
            functionChartInstance.destroy();
            functionChartInstance = null;
        }
        if (convergenceChartInstance) {
            convergenceChartInstance.destroy();
            convergenceChartInstance = null;
        }
    }
});