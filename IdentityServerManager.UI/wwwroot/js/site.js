var successMessage = $('#SuccessMessage').val();
var errorMessage = $('#ErrorMessage').val();
var isDirty = false;

$(document).ready(function () {

    utils.ui.hideSpinner();

    $("input, select, textarea").on("change", function () {
        isDirty = true;
    });

    if (successMessage != "" && successMessage != undefined ) {
        $.notify({
            title: 'Success',
            icon: 'fa fa-check',
            message: successMessage
        }, { type: 'success', timer: 2000 });
    }

    if (errorMessage != "" && errorMessage != undefined) {
        $.notify({
            title: 'Error',
            icon: 'fa fa-times',
            message: errorMessage
        }, { type: 'danger', timer: 2000 });
    }

    $('form').bind('invalid-form.validate', function () {
        $.notify({
            title: 'Warning',
            icon: 'fa fa-exclamation',
            message: 'There are invalid fields.'
        }, { type: 'warning', timer: 2000 });
    });

    $('[data-toggle="tooltip"]').tooltip();

});

function saveData(nextUrl, url) {
    utils.ui.showSpinner();
    if (isDirty) {
        $('#NextUrl').val(nextUrl);
        $("#createForm").submit();
    }
    else {
        location.href = url;
    }
}

function deleteItem(id) {
    BootstrapDialog.show({
        title: 'Delete Item',
        message: 'Do you want to delete this Item?',
        buttons: [{
            label: 'Yes',
            cssClass: 'btn-success',
            action: function (dialog) {
                $('#Id').val(id);
                $("#deleteForm").submit();
                dialog.close();
            }
        }, {
            label: 'No',
            cssClass: 'btn-danger',
            action: function (dialog) {
                dialog.close();
            }
        }]
    });
};

function showDetails(id, module) {
    $.ajax({ url: '/' + module + '/Details/' + id })
        .done(function (response) {
            if (response) {
                BootstrapDialog.show({
                    title: 'Details',
                    message: $('<div></div>').html(response),
                    buttons: [{
                        label: 'Close',
                        cssClass: 'btn-primary',
                        action: function (dialog) {
                            dialog.close();
                        }
                    }]
                });
            }
        });
};