const appendAlert = (alertDiv, message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert" show={showAlert}>`,
      `   <div>${message}</div>`,
      '   <button type="button" id="dismissAlertBtn" class="btn-close" data-bs-dismiss="alert" onClick={closeAlert} aria-label="Close"></button>',
      '</div>'
    ].join('')
  
    alertDiv.append(wrapper)
}

export default appendAlert;