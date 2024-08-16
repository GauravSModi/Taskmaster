const appendAlert = (alertDiv, message, type, options) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible ${options} role="alert" show={showAlert}>`,
        `   <div>${message}</div>`,
        // '   <button type="button" class="close" data-dismiss="alert" aria-label="Close">',
        // '       <span aria-hidden="true">&times;</span>',
        // '   </button>',
        '</div>'
    ].join('')
  
    alertDiv.append(wrapper)
}

export default appendAlert;