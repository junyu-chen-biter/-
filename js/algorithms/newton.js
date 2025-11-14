/**
 * 牛顿迭代法求解方程 f(x) = 0
 * @param {function} f - 函数 f(x)
 * @param {function} df - 导数函数 f'(x)
 * @param {number} x0 - 初始值
 * @param {number} tolerance - 收敛精度
 * @param {number} maxIter - 最大迭代次数
 * @returns {object} - 包含迭代结果的对象
 *                     { converged: boolean, root: number, iterations: number, history: array, message: string }
 */
function newtonMethod(f, df, x0, tolerance, maxIter) {
    const history = [];
    let xn = x0;
    let fn = f(xn);

    // 记录初始值
    history.push({
        iteration: 0,
        x: xn,
        fx: fn,
        error: null // 第一次迭代没有前一个值，误差为 null
    });

    for (let n = 1; n <= maxIter; n++) {
        const dxn = df(xn);

        // 检查导数是否为零，避免除以零
        if (Math.abs(dxn) < 1e-12) {
            return {
                converged: false,
                root: null,
                iterations: n,
                history: history,
                message: `迭代在第 ${n} 步失败：导数为零，无法继续。`
            };
        }

        const xn1 = xn - fn / dxn;
        const fn1 = f(xn1);
        
        // 计算误差 (这里使用 |x_{n+1} - x_n|)
        const error = Math.abs(xn1 - xn);

        // 记录迭代过程
        history.push({
            iteration: n,
            x: xn1,
            fx: fn1,
            error: error
        });

        // 检查是否收敛
        if (error < tolerance || Math.abs(fn1) < tolerance) {
            return {
                converged: true,
                root: xn1,
                iterations: n,
                history: history,
                message: `在第 ${n} 步收敛。`
            };
        }

        // 更新为下一次迭代的值
        xn = xn1;
        fn = fn1;
    }

    // 如果达到最大迭代次数仍未收敛
    return {
        converged: false,
        root: null,
        iterations: maxIter,
        history: history,
        message: `达到最大迭代次数 ${maxIter}，未收敛。`
    };
}