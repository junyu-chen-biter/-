/**
 * 单点弦截法求解方程 f(x) = 0
 * @param {function} f - 函数 f(x)
 * @param {number} x0 - 初始值
 * @param {number} tolerance - 收敛精度
 * @param {number} maxIter - 最大迭代次数
 * @returns {object} - 包含迭代结果的对象
 */
function secantSingleMethod(f, x0, tolerance, maxIter) {
    const history = [];
    // 单点弦截法需要两个初始值，这里我们固定 x1 = x0 + h，h 是一个小扰动
    const h = 1e-4;
    let x_prev = x0;
    let x_curr = x0 + h;
    let fx_prev = f(x_prev);
    let fx_curr = f(x_curr);

    history.push({ iteration: 0, x: x_prev, fx: fx_prev, error: null });
    history.push({ iteration: 1, x: x_curr, fx: fx_curr, error: Math.abs(x_curr - x_prev) });

    for (let n = 2; n <= maxIter; n++) {
        if (Math.abs(fx_curr - fx_prev) < 1e-12) {
            return { converged: false, root: null, iterations: n, history, message: "函数值差异过小，无法继续迭代。" };
        }

        // 单点弦截法公式：用 x0 和 xn 来近似导数
        const x_next = x_curr - fx_curr * (x_curr - x_prev) / (fx_curr - fx_prev);
        const fx_next = f(x_next);
        const error = Math.abs(x_next - x_curr);

        history.push({ iteration: n, x: x_next, fx: fx_next, error });

        if (error < tolerance || Math.abs(fx_next) < tolerance) {
            return { converged: true, root: x_next, iterations: n, history, message: `在第 ${n} 步收敛。` };
        }

        // 更新值，注意：单点弦截法始终用 x_prev (即 x0) 作为第二个点
        x_curr = x_next;
        fx_curr = fx_next;
    }

    return { converged: false, root: null, iterations: maxIter, history, message: "达到最大迭代次数，未收敛。" };
}