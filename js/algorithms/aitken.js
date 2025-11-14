/**
 * 埃特肯加速法求解方程 x = g(x) 的不动点
 * @param {function} g - 迭代函数 g(x)
 * @param {number} x0 - 初始值
 * @param {number} tolerance - 收敛精度
 * @param {number} maxIter - 最大迭代次数
 * @returns {object} - 包含迭代结果的对象
 */
function aitkenMethod(g, x0, tolerance, maxIter) {
    const history = [];
    let xn = x0;
    history.push({ iteration: 0, x: xn, error: null });

    for (let n = 1; n <= maxIter; n++) {
        const xn1 = g(xn);
        const xn2 = g(xn1);

        // 埃特肯加速公式
        const denominator = xn2 - 2 * xn1 + xn;
        if (Math.abs(denominator) < 1e-12) {
            return { converged: false, root: null, iterations: n, history, message: "埃特肯加速法分母为零，无法继续。" };
        }

        const x_bar_n = xn - Math.pow(xn1 - xn, 2) / denominator;
        const error = Math.abs(x_bar_n - xn);

        history.push({ iteration: n, x: x_bar_n, error });

        if (error < tolerance) {
            return { converged: true, root: x_bar_n, iterations: n, history, message: `在第 ${n} 步收敛。` };
        }

        xn = x_bar_n;
    }

    return { converged: false, root: null, iterations: maxIter, history, message: "达到最大迭代次数，未收敛。" };
}