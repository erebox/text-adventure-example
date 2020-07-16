<?php
    session_start();
    require_once __DIR__ . '/vendor/autoload.php';
    use Erebox\TextAdventureEngine\TextAdventureEngine;

    $data = (isset($_REQUEST['data'])? $_REQUEST['data'] : null);
    $response = [];
    $quest = "json/test.json";

    if ($data == "RESET") {
        unset($_SESSION['adv']);
        exit();
    }
    if ($data == "INFO") {
        phpinfo();
        exit();
    }

    if (isset($_SESSION['adv'])) {
        $adv = unserialize($_SESSION['adv']);
        if ($adv->ended()) {
            $game_json = file_get_contents($quest);
            $adv = new TextAdventureEngine($game_json);
            $data = null;
        }
    } else {
        $game_json = file_get_contents($quest);
        $adv = new TextAdventureEngine($game_json);
    }

    if ($data) {
        if ($data == "RESTART") {
            $adv->restart();
        } else {
            $adv->parse($data);
        }
    }
    $response = $adv->get();

    $_SESSION['adv'] = serialize($adv);
    print_r(json_encode($response, JSON_PRETTY_PRINT));
?>