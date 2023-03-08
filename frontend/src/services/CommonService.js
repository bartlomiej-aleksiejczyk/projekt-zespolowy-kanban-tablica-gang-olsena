const toastCallback = function(response_data, successCallback) {
    console.log(response_data, successCallback);
    if(response_data.success) {
        if(response_data.message && response_data.message.length > 0) {
            window.PrimeToast.show({
                severity: 'success',
                summary : 'Powodzenie',
                detail  : response_data.message,
                life    : 3000
            });
        }
        successCallback(response_data.data);
    } else {
        window.PrimeToast.show({
            severity: 'warn',
            summary : 'Ostrzeżenie',
            detail  : response_data.message,
            life    : 3000
        });
    }
}
export default toastCallback;