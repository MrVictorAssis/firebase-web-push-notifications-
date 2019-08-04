<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('P3P: CP="CAO PSA OUR"'); // Makes IE to support cookies
header("Content-Type: application/json; charset=utf-8");
ini_set ('post_max_size', '256MB');


$fields = array(
    'notification' => array(
      'title' => "Titulo da Notificação",
      'body' => "Mensagem",
      'click_action' => "https://github.com/MrVictorAssis/firebase-web-push-notifications-",
      'icon' => "http://adoracaoevida.com/www/wp-content/gallery/eu-fui_1/foto_teste_2.jpg"
    ),
  'to' => "/topics/all"
);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://fcm.googleapis.com/fcm/send");
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
                       'Authorization: key={{your authorization key here}}'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_HEADER, TRUE);
curl_setopt($ch, CURLOPT_POST, TRUE);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);


$response = curl_exec($ch);
curl_close($ch);

echo true;




 ?>
