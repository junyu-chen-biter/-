/**
 * 绘制函数图像和迭代点
 * @param {HTMLCanvasElement} canvas - canvas 元素
 * @param {Chart} chartInstance - 已存在的 Chart 实例，用于销毁重建
 * @param {function} f - 函数 f(x)
 * @param {number} xMin - x 轴最小值
 * @param {number} xMax - x 轴最大值
 * @param {array} xPoints - 迭代点的 x 坐标数组
 * @param {array} yPoints - 迭代点的 y 坐标数组
 * @param {string} method - 使用的迭代方法
 * @returns {Chart} - 新创建的 Chart 实例
 */
function plotFunctionAndPoints(canvas, chartInstance, f, xMin, xMax, xPoints, yPoints, method) {
    // 如果已有图表，先销毁
    if (chartInstance) {
        chartInstance.destroy();
    }

    // 生成函数图像的数据点
    const numPoints = 500; // 采样点数
    const functionX = [];
    const functionY = [];
    const step = (xMax - xMin) / numPoints;
    for (let i = 0; i <= numPoints; i++) {
        const x = xMin + i * step;
        functionX.push(x);
        functionY.push(f(x));
    }

    // 准备迭代点的数据（只显示前几个点的连线，避免图表混乱）
    const displayPointsCount = Math.min(10, xPoints.length); // 最多显示10步的连线
    const traceX = xPoints.slice(0, displayPointsCount);
    const traceY = yPoints.slice(0, displayPointsCount);

    // 配置 Chart.js
    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                type: 'line',
                label: 'f(x)',
                data: functionX.map((x, i) => ({x: x, y: functionY[i]})),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                tension: 0.1,
                pointRadius: 0
            }, {
                type: 'line',
                label: `迭代轨迹 (前${displayPointsCount}步)`,
                data: traceX.map((x, i) => ({x: x, y: traceY[i]})),
                borderColor: 'rgb(255, 99, 132)',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false,
            }, {
                type: 'scatter',
                label: '迭代点',
                data: xPoints.map((x, i) => ({x: x, y: yPoints[i]})),
                backgroundColor: 'rgb(255, 99, 132)',
                pointRadius: 5,
                pointHoverRadius: 7,
            }, {
                type: 'line',
                label: 'y = 0',
                data: [{x: xMin, y: 0}, {x: xMax, y: 0}],
                borderColor: 'rgb(153, 102, 255)',
                borderDash: [2, 2],
                pointRadius: 0,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'x' },
                    min: xMin,
                    max: xMax
                },
                y: {
                    title: { display: true, text: 'f(x)' },
                    // 自动调整 y 轴范围以适应数据
                }
            },
            plugins: {
                title: { display: true, text: `函数图像与${getMethodName(method)}迭代过程` },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed.x !== null) {
                                label += `(${context.parsed.x.toFixed(6)}, ${context.parsed.y.toFixed(6)})`;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

/**
 * 绘制收敛曲线
 * @param {HTMLCanvasElement} canvas - canvas 元素
 * @param {Chart} chartInstance - 已存在的 Chart 实例
 * @param {array} history - 迭代历史数据
 * @returns {Chart} - 新创建的 Chart 实例
 */
function plotConvergence(canvas, chartInstance, history) {
    if (chartInstance) {
        chartInstance.destroy();
    }

    const iterations = history.map(step => step.iteration);
    const errors = history.map(step => step.error).filter(e => e !== null); // 过滤掉初始值的 null 误差
    
    // 如果没有误差数据，则不绘制
    if (errors.length === 0) {
        return null;
    }

    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: iterations.slice(1, 1 + errors.length), // 从第1次迭代开始
            datasets: [{
                label: '迭代误差 |x_{n+1} - x_n|',
                data: errors,
                borderColor: 'rgb(99, 102, 255)',
                backgroundColor: 'rgba(99, 102, 255, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: '迭代次数' },
                    type: 'linear'
                },
                y: {
                    title: { display: true, text: '误差' },
                    type: 'logarithmic' // 使用对数坐标更清晰地展示收敛过程
                }
            },
            plugins: {
                title: { display: true, text: '迭代收敛曲线 (对数坐标)' }
            }
        }
    });
}

// 辅助函数：将方法值转换为中文名称
function getMethodName(methodValue) {
    const methodNames = {
        'newton': '牛顿',
        'newtonDownhill': '牛顿下山',
        'aitken': '埃特肯',
        'secantSingle': '单点弦截',
        'secantDouble': '双点弦截'
    };
    return methodNames[methodValue] || methodValue;
}