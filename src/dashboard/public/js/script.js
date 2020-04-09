$(document).ready(() => {
  const registerSubmitHandler = (formName) => {
    $(`#form-${formName}`).submit((e) => {
      e.preventDefault();
  
      // Serialize the form to an array
      let formDataArray = $(`#form-${formName}`).serializeArray();
      formDataArray.map((x) => {
        if (x.value === 'on') {
          // Map checkboxes to be true instead of on
          x.value = true;
        }
      });

      // Include unchecked checkboxes
      $(`#form-${formName} input[type="checkbox"]:not(:checked)`).toArray().forEach(element => {
        formDataArray.push({ name: element.name, value: false });
      });

      // Convert array to object
      let formData = {};
      formDataArray.forEach((x) => {
        formData[x.name] = x.value;
      });
      
      // Post to backend
      $.ajax({
        url: `/data/${formName}`,
        type: 'post',
        data: {
          data: JSON.stringify(formData)
        },
        success() {
          location.reload();
        },
      });
    });
  };

  // Register forms
  registerSubmitHandler('imageoftheday');
  registerSubmitHandler('redditMemes');
  registerSubmitHandler('spotify')
  registerSubmitHandler('dfstatus');
  registerSubmitHandler('news');
});
