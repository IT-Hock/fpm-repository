import * as $ from "jquery";
import Swal from "sweetalert2";
import iziToast from "izitoast";

export module Alert {
    export function showError(message: string, callback: () => void = ():void => {}): void {
        Swal.fire({
            title: 'Error',
            html: $('<div/>').text(message).html() +
                "<br/>If this error persists, please open an issue on <a href='https://github.com/IT-Hock/fpm-repository' target='_blank'>GitHub</a>.",
            icon: 'error',
            confirmButtonText: 'Ok'
        }).then(() => {
            callback();
        });
    }

    export function showSuccess(message: string, callback: () => void = ():void => {}): void {
        Swal.fire({
            title: 'Success',
            html: $('<div/>').text(message).html(),
            icon: 'success',
            confirmButtonText: 'Ok'
        }).then(() => {
            callback();
        });
    }

    export function showInfo(message: string, callback: () => void = ():void => {}): void {
        Swal.fire({
            title: 'Info',
            html: $('<div/>').text(message).html(),
            icon: 'info',
            confirmButtonText: 'Ok'
        }).then(() => {
            callback();
        });
    }

    export function showWarning(message: string, callback: () => void = ():void => {}): void {
        Swal.fire({
            title: 'Warning',
            html: $('<div/>').text(message).html(),
            icon: 'warning',
            confirmButtonText: 'Ok'
        }).then(() => {
            callback();
        });
    }

    export function showConfirm(message: string, callback: (result: boolean) => void): void {
        Swal.fire({
            title: 'Confirm',
            html: $('<div/>').text(message).html(),
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            callback(result.isConfirmed);
        });
    }

    export function showErrorToast(message: string, callback: () => void = ():void => {}): void {
        iziToast.error({
            title: 'Error',
            message: message,
            position: 'topRight',
            timeout: 5000,
            onClosed: () => {
                callback();
            }
        });
    }

    export function showSuccessToast(message: string, callback: () => void = ():void => {}): void {
        iziToast.success({
            title: 'Success',
            message: message,
            position: 'topRight',
            timeout: 5000,
            onClosed: () => {
                callback();
            }
        });
    }

    export function showInfoToast(message: string, callback: () => void = ():void => {}): void {
        iziToast.info({
            title: 'Info',
            message: message,
            position: 'topRight',
            timeout: 5000,
            onClosed: () => {
                callback();
            }
        });
    }

    export function showWarningToast(message: string, callback: () => void = ():void => {}): void {
        iziToast.warning({
            title: 'Warning',
            message: message,
            position: 'topRight',
            timeout: 5000,
            onClosed: () => {
                callback();
            }
        });
    }
}