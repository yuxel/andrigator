package com.phonegap.example;

import android.content.pm.ActivityInfo;
import android.app.Activity;
import android.os.Bundle;
import com.phonegap.*;

public class Andrigator extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
        //super.loadUrl("http://192.168.1.4/and/Andrigator/assets/www/");
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    }
}

