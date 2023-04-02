import i18n from 'i18next';

const CommonService = {

    toastCallback: function(response_data, successCallback,successCallback1,successCallback2,successCallback3) {
        if(response_data.success) {
            if(response_data.message && response_data.message.length > 0) {
                window.PrimeToast.show({
                    severity: 'success',
                    summary : i18n.t("succes"),
                    detail  : i18n.t(response_data.message),
                    life    : 3000
                });
            }
        } else {
            window.PrimeToast.show({
                severity: 'warn',
                summary : i18n.t("warning"),
                detail  : i18n.t(response_data.message),
                life    : 3000
            });
        }
        if(successCallback && response_data.data) {
            console.log("1")
            successCallback(response_data.data);
        }
        if(successCallback1 && response_data.data1) {
            console.log("data1")
            successCallback1(response_data.data1);
        }
        if(successCallback2 && response_data.data2) {
            console.log("2")
            successCallback2(response_data.data2);
        }
        if(successCallback3 && response_data.data3) {
            console.log("2")
            successCallback3(response_data.data3);
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