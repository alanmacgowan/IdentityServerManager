(function ($, window) {
    'use strict';

    var utils = window.utils || {};

    var form = (function () {

        function saveEdit(controller, data, callbackUrl) {
            saveData(controller, data, 'Edit', callbackUrl);
        }

        function saveCreate(controller, data, callbackUrl) {
            saveData(controller, data, 'Create', callbackUrl);
        }

        function getFormData() {
            var formData = $("form").serialize({ checkboxesAsBools: true }).split("&");
            var obj = {};
            $.each(formData, function (index) { obj[formData[index].split("=")[0]] = formData[index].split("=")[1]; });
            return obj;
        }

        function saveData(controller, data, action, callbackUrl) {
            var values = data || getFormData();
            var validator = $("form").validate();
            if (validator.form()) {
                utils.http.post({ url: '/' + controller + '/' + action, data: values }, function (response) {
                    if (response.data && response.data.id == undefined) {
                        for (var key in response.data) {
                            var elem = $('#' + key);
                            if (elem != null) {
                                $(elem).addClass('invalid-field').removeClass('valid-field');
                            }
                        }
                        notification.showWarning();
                    } else {
                        if (callbackUrl == undefined) {
                            location.href = '/' + controller + '/index?SuccessMessage=Successful operation.';
                        } else {
                            callbackUrl(response.data.id);
                        }
                    }
                });
            } else {
                validator.invalidElements().each(function (index, element) {
                    $(element).addClass('invalid-field');
                });
                notification.showWarning();
            }
        }

        return {
            saveData: saveData,
            saveCreate: saveCreate,
            saveEdit: saveEdit
        }

    })();

    var notification = (function () {
     
        function setSuccessMessage(message) {
            $('#SuccessMessage').val(message || 'Successful operation.')
        }

        function setErrorMessage(message) {
            $('#ErrorMessage').val(message || 'There was an error processing the operation.')
        }

        function showSuccess(message) {
            $.notify({
                title: 'Success',
                icon: 'fa fa-check',
                message: message || 'Successful operation.'
            }, { type: 'success', timer: 2000 });
        }

        function showError(message) {
            $.notify({
                title: 'Error',
                icon: 'fa fa-times',
                message: message || 'There was an error processing the operation.'
            }, { type: 'danger', timer: 2000 });
        }

        function showWarning(message) {
            $.notify({
                title: 'Warning',
                icon: 'fa fa-exclamation',
                message: message || 'There are invalid fields.'
            }, { type: 'warning', timer: 2000 });
        }

        return {
            showSuccess: showSuccess,
            showError: showError,
            showWarning: showWarning,
            setSuccessMessage: setSuccessMessage,
            setErrorMessage: setErrorMessage

        }

    })();

    var ui = (function () {

        var spinner = new Spinner();

        function showSpinner() {
            var target = document.getElementById('main');
            spinner.spin(target);
        }

        function hideSpinner() {
            spinner.stop();
        }

        return {
            showSpinner: showSpinner,
            hideSpinner: hideSpinner
        }

    })();

    var http = (function () {

        var successMessage = 'Successful operation.';
        var errorMessage = 'There was an error processing the operation.';

        function successCallbackFunction(response) {
            if (response) {
                notification.showSuccess();
            } else {
                notification.showError();
            }
        }

        function errorCallbackFunction(message) {
            notification.showError(message);
        }

        function post(options, successCallback, errorCallback) {
            var config = { headers: { 'Content-Type': 'application/json; charset=utf-8' } };
            var data = options.data || null;
            var successFunction = successCallback || successCallbackFunction;
            var errorFunction = errorCallback || errorCallbackFunction;

            ui.showSpinner();

            axios.post(options.url, data, config)
                .then(function (response) {
                    successFunction(response);
                    ui.hideSpinner();
                })
                .catch(function (error) {
                    errorFunction(error.response.data.ErrorMessage);
                    ui.hideSpinner();
                });
        }

        function get(options, successCallback, errorCallback) {
            var successFunction = successCallback || successCallbackFunction;
            var errorFunction = errorCallback || errorCallbackFunction;

            ui.showSpinner();

            axios.get(options.url)
                .then(function (response) {
                    successFunction(response);
                    ui.hideSpinner();
                })
                .catch(function (error) {
                    errorFunction();
                    ui.hideSpinner();
                });
        }

        return {
            post: post,
            get: get
        }

    })();

    utils = (function () {
        return {
            constructor: utils,
            form: form,
            http: http,
            ui: ui,
            notification: notification
        };
    })();

    window.utils = utils;


})($, window);