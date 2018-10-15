<?php
    session_start();
    require_once __DIR__ . '/vendor/autoload.php';
    use Erebox\TextAdventureEngine\Engine;

    $data = (isset($_REQUEST['data'])? $_REQUEST['data'] : null);
    $response = [];
    $quest = "json/mago.json";

    if ($data == "RESET") {
        unset($_SESSION['adv']);
        exit();
    }

    if (isset($_SESSION['adv'])) {
        $adv = unserialize($_SESSION['adv']);
        if ($adv->ended()) {
            $game_json = file_get_contents($quest);
            $adv = new Engine($game_json);
            $data = null;
        }
    } else {
        $game_json = file_get_contents($quest);
        $adv = new Engine($game_json);
    }

    if ($data) {
        if ($data == "DEBUG") {
            print_r(json_encode($adv->debug()));
            $game_json = file_get_contents($quest);
            $adv = new Engine($game_json);
            exit();
        }
        $adv->parse($data);
    }
    $response = $adv->get();

    $_SESSION['adv'] = serialize($adv);
    print_r(json_encode($response, JSON_PRETTY_PRINT));
?>