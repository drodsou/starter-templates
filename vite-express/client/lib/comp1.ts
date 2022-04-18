

function render({name,action, options}) {
  return `
    <select ${}>
      ${options.map(option => `
        <option ${option.selected ? 'selected' : ''} value="${option.value}">${option.text}</option>
      `).join('\n')}
    </select>

  `;
}


