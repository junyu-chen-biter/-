/**
 * 牛顿下山法求解方程 f(x) = 0
 * @param {function} f - 函数 f(x)
 * @param {function} df - 导数函数 f'(x)
 * @param {number} x0 - 初始值
 * @param {number} tolerance - 收敛精度
 * @param {number} maxIter - 最大迭代次数
 * @returns {object} - 包含迭代结果的对象
 */
function newtonDownhillMethod(f, df, x0, tolerance, maxIter) {
    const history = [];
    let xn = x0;
    let fn = f(xn);
    history.push({ iteration: 0, x: xn, fx: fn, error: null, lambda: 1 });

    for (let n = 1; n <= maxIter; n++) {
        let lambda = 1.0; // 下山因子
        const dxn = df(xn);
        if (Math.abs(dxn) < 1e-12) {
            return { converged: false, root: null, iterations: n, history, message: "导数为零，无法继续迭代。" };
        }

        let xn1 = xn - lambda * fn / dxn;
        let fn1 = f(xn1);

        // 下山准则：确保 |f(xn1)| < |f(xn)|
        while (Math.abs(fn1) >= Math.abs(fn) && lambda >= 1e-4) {
            lambda *= 0.5; // 减半下山因子
            xn1 = xn - lambda * fn / dxn;
            fn1 = f(xn1);
        }

        if (lambda < 1e-4) {
            return { converged: false, root: null, iterations: n, history, message: "下山因子过小，无法收敛。" };
        }

        const error = Math.abs(xn1 - xn);
        history.push({ iteration: n, x: xn1, fx: fn1, error, lambda });

        if (error < tolerance || Math.abs(fn1) < tolerance) {
            return { converged: true, root: xn1, iterations: n, history, message: `在第 ${n} 步收敛。` };
        }

        xn = xn1;
        fn = fn1;
    }

    return { converged: false, root: null, iterations: maxIter, history, message: "达到最大迭代次数，未收敛。" };
}