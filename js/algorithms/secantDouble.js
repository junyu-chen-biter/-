/**
 * 双点弦截法求解方程 f(x) = 0
 * @param {function} f - 函数 f(x)
 * @param {number} x0 - 初始值 1
 * @param {number} x1 - 初始值 2
 * @param {number} tolerance - 收敛精度
 * @param {number} maxIter - 最大迭代次数
 * @returns {object} - 包含迭代结果的对象
 */
function secantDoubleMethod(f, x0, x1, tolerance, maxIter) {
    const history = [];
    let x_prev_prev = x0;
    let x_prev = x1;
    let fx_prev_prev = f(x_prev_prev);
    let fx_prev = f(x_prev);

    history.push({ iteration: 0, x: x_prev_prev, fx: fx_prev_prev, error: null });
    history.push({ iteration: 1, x: x_prev, fx: fx_prev, error: Math.abs(x_prev - x_prev_prev) });

    for (let n = 2; n <= maxIter; n++) {
        if (Math.abs(fx_prev - fx_prev_prev) < 1e-12) {
            return { converged: false, root: null, iterations: n, history, message: "函数值差异过小，无法继续迭代。" };
        }

        // 双点弦截法公式：用 x_{n-1} 和 x_{n-2} 来近似导数
        const x_curr = x_prev - fx_prev * (x_prev - x_prev_prev) / (fx_prev - fx_prev_prev);
        const fx_curr = f(x_curr);
        const error = Math.abs(x_curr - x_prev);

        history.push({ iteration: n, x: x_curr, fx: fx_curr, error });

        if (error < tolerance || Math.abs(fx_curr) < tolerance) {
            return { converged: true, root: x_curr, iterations: n, history, message: `在第 ${n} 步收敛。` };
        }

        // 更新值
        x_prev_prev = x_prev;
        fx_prev_prev = fx_prev;
        x_prev = x_curr;
        fx_prev = fx_curr;
    }

    return { converged: false, root: null, iterations: maxIter, history, message: "达到最大迭代次数，未收敛。" };
}