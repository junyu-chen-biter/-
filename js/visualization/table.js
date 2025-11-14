/**
 * 更新迭代过程表格
 * @param {array} history - 迭代历史数据数组
 */
function updateIterationsTable(history) {
    const tableBody = document.querySelector('#iterations-table tbody');
    tableBody.innerHTML = ''; // 清空表格

    history.forEach(step => {
        const row = document.createElement('tr');
        
        // 为最后一行添加特殊样式
        if (step.iteration === history.length - 1) {
            row.classList.add('final-step');
        }

        row.innerHTML = `
            <td>${step.iteration}</td>
            <td>${step.x.toFixed(10)}</td>
            <td>${step.fx.toExponential(6)}</td>
            <td>${step.error !== null ? step.error.toExponential(6) : '-'}</td>
        `;
        tableBody.appendChild(row);
    });

    // 为最终结果行添加高亮样式
    document.querySelectorAll('#iterations-table tbody tr.final-step').forEach(row => {
        row.style.backgroundColor = '#d4edda';
    });
}