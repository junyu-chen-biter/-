// 使用 math.js 解析表达式
// 确保在 HTML 中先引入了 math.min.js

/**
 * 将方程字符串解析为一个可计算的函数 f(x)
 * @param {string} equationStr - 方程字符串，如 "x^3 - x - 1"
 * @returns {function} - 一个接收 x 并返回 f(x) 值的函数
 */
function parseEquation(equationStr) {
    try {
        // math.js 的 parse 会将表达式转换为一个节点树
        const node = math.parse(equationStr);
        
        // compile 会将节点树转换为一个可执行的函数
        // scope 定义了函数的输入变量，这里是 'x'
        const code = node.compile();

        // 返回一个函数，该函数接收 x 值，计算并返回结果
        return function(x) {
            return code.evaluate({ x: x });
        };
    } catch (error) {
        throw new Error(`无效的方程表达式: ${error.message}`);
    }
}

/**
 * 计算函数 f(x) 的导数函数 f'(x)
 * @param {function} f - 原函数
 * @param {string} equationStr - 原函数的方程字符串 (用于更精确的符号求导)
 * @returns {function} - 导数函数 f'(x)
 */
function derivative(f, equationStr) {
    try {
        // 尝试使用 math.js 进行符号求导
        const fNode = math.parse(equationStr);
        const dfNode = math.derivative(fNode, 'x');
        const dfCode = dfNode.compile();
        
        return function(x) {
            return dfCode.evaluate({ x: x });
        };
    } catch (error) {
        console.warn("符号求导失败，将使用数值微分:", error);
        // 备用方案：数值微分
        const h = 1e-7;
        return function(x) {
            return (f(x + h) - f(x - h)) / (2 * h);
        };
    }
}