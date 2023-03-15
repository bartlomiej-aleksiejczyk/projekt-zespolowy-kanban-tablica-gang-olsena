const CommonService = {
    toastCallback: function(response_data, successCallback) {
        if(response_data.success) {
            if(response_data.message && response_data.message.length > 0) {
                window.PrimeToast.show({
                    severity: 'success',
                    summary : 'Powodzenie',
                    detail  : response_data.message,
                    life    : 3000
                });
            }
        } else {
            window.PrimeToast.show({
                severity: 'warn',
                summary : 'Ostrzeżenie',
                detail  : response_data.message,
                life    : 3000
            });
        }
        if(successCallback && response_data.data) {
            successCallback(response_data.data);
        }
    },
    onOpenDialog : (callback, setters) => {
        callback(true);

        setters.forEach(setter => {
            setter.callback(setter.value);
        });
    }
}
export default CommonService;