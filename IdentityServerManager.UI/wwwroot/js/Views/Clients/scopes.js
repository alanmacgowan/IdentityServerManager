var assignedVals = [];
var actionRedirect;

$(document).ready(function () {

    $('#save').on('click', function () {
        saveData('Clients');
    });

    saveAssigned();

    $('#assign').on('click', function (e) {
        var selectedOpts = $('#AvailableScopes option:selected');
        if (selectedOpts.length == 0) {
            e.preventDefault();
        }
        $('#AssignedScopes').append($(selectedOpts).clone());
        $(selectedOpts).remove();
        e.preventDefault();
        saveAssigned();
    });

    $('#assignAll').on('click', function (e) {
        var selectedOpts = $('#AvailableScopes option');
        if (selectedOpts.length == 0) {
            e.preventDefault();
        }
        $('#AssignedScopes').append($(selectedOpts).clone());
        $(selectedOpts).remove();
        e.preventDefault();
        saveAssigned();
    });

    $('#unassign').on('click', function (e) {
        var selectedOpts = $('#AssignedScopes option:selected');
        if (selectedOpts.length == 0) {
            e.preventDefault();
        }
        $('#AvailableScopes').append($(selectedOpts).clone());
        $(selectedOpts).remove();
        e.preventDefault();
        saveAssigned();
    });

    $('#unassignAll').on('click', function (e) {
        var selectedOpts = $('#AssignedScopes option');
        if (selectedOpts.length == 0) {
            e.preventDefault();
        }
        $('#AvailableScopes').append($(selectedOpts).clone());
        $(selectedOpts).remove();
        e.preventDefault();
        saveAssigned();
    });

    function saveAssigned() {
        assignedVals = [];
        $("#AssignedScopes option").each(function () {
            assignedVals.push({ Id: this.value, Name: this.value });
        });
        $('#AssignedResources').val(JSON.stringify(assignedVals));
    };


});

function saveData(controller, action) {
    utils.ui.showSpinner();
    var url = action != undefined ? '/' + controller + '/' + action + '/' + $('#Id').val() : '/' + controller + '/index';
    if (isDirty) {
        actionRedirect = action == undefined ? 'index' : action;
        var data = { Id: $('#Id').val(), AssignedResources: $('#AssignedResources').val() };
        utils.form.saveData('Clients', data, 'Scopes', redirectToUrl);
    }
    else {
        if ($('#Id').val() != 0) {
            var url = action == undefined ? '/' + controller + '/index' : '/' + controller + '/' + action + '/' + $('#Id').val();
            location.href = url;
        } else {
            $("form").validate();
            utils.ui.hideSpinner();
        }
    }
}

function redirectToUrl(id) {
    location.href = '/Clients/' + actionRedirect + '/' + $('#Id').val() + '?SuccessMessage=Successful operation.';
}