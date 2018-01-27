var successMessage = $('#SuccessMessage').val();
var errorMessage = $('#ErrorMessage').val();
var isDirty = false;

$(document).ready(function () {

    //utils.ui.hideSpinner();
    $('.select').select2();

    $("input, select, textarea").on("change", function () {
        isDirty = true;
    });

    if (successMessage != "" && successMessage != undefined) {
        utils.notification.showSuccess(successMessage);
    }

    if (errorMessage != "" && errorMessage != undefined) {
        utils.notification.showError(errorMessage);
    }

    $('[data-toggle="tooltip"]').tooltip();

});

function saveData(controller, action) {
    utils.ui.showSpinner();
    if (isDirty) {
        $('#NextUrl').val(action);
        $("#createForm").submit();
    }
    else {
        if ($('#Id').val() != 0) {
            location.href = '/' + controller + '/' + action + '/' + $('#Id').val();
        }
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