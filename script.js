//Ao iniciar captura o token na variavel global, se possuir
var token = window.sessionStorage.getItem("token");

if ("serviceWorker" in navigator) {//verifica se há um service worker disponível, se sim registra
    navigator.serviceWorker.register("sw.js", { scope: './' })//primeiro parametro é o path do SW e o segundo o escopo de onde ele atuara
        .then(function (registration) {
            //se der certo no registro, o firebase integrará ao evento messaging
            firebase.messaging().useServiceWorker(registration);
        })
        .catch(function () {
            console.warn("Service Worker Failed!");
        })
    //permissão de notificação ao usuario, se concedido, assina-lo
    switch (Notification.permission) {
        case 'granted':
            console.log('already granted');
            break;
        case 'denied':
            console.log('blocked!!')
            break;
        case 'default':
        default:
            console.log('get permission')
            Notification.requestPermission(function (status) {
                console.log('Notification permission status:', status);
                if (status == "granted") {
                    //se ok, assinar
                    subscribe()
                }
            });
            break;
    };

}

function dispara() {
    // console.log(token)
    if (token) {
        $.ajax({
            url: 'server.php',
            type: 'POST'
        }).done(function (data) {
            console.log(data)
            alert("Notificação disparada!");
        })
            .fail(function (data) {
                console.log(data);
                alert("Erro ao disparar notificações!");
            });
    } else {
        alert("Token Inválido! O usuário bloqueou as notificações")
    }
}

const subscribe = async () => {//funcao async await para passar permissao de notificações

    try {
        //efetua requisição pelo token do messaging do firebase
        const messaging = firebase.messaging();
        await messaging.requestPermission();
        token = await messaging.getToken();
        console.log('token do usuário:', token);
        //armazena o token no session storage
        window.sessionStorage.setItem("token", token)

        $.ajax({//requisição para cadastrar o token do dispositivo no topico
            url: 'https://iid.googleapis.com/iid/v1/' + token + '/rel/topics/all',
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAwr2UIes:APA91bHlcj2moRddH2NPJ5ESOZas4RAmlZ7g7i_CBzZBdDfka9L8ryTG_nCS9TLP44DdWoBdnCObRA6tiArgnH4mVCTf_POb1bSh8jgKFe9cPS6joVLFD46-o8_skQY901sdi6sfYoVX'
            }
        }).done(function (data) {

            alert("Pronto para receber Notificações!");
        })
            .fail(function (data) {

                console.log(data);
                alert("Erro ao assinar notificações!");
            });
        //  return token;
    } catch (error) {

        alert("Erro ao assinar notificações!");
        console.error(error);
    }
}