<?php

function is_fieldEmpty($arrary){

    foreach( $arrary as $value){
        if(empty($value)){
              return true;
            break;
        }
        return false;
    }
}

function unitArray($arr1,$arr2){
    
    foreach($arr2 as $dato){
        array_push($arr1,$dato);
    }
    return $arr1;
}