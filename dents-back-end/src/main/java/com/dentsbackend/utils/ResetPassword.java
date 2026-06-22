package com.dentsbackend.utils;


import com.dentsbackend.entities.User;

import java.time.LocalDateTime;
import java.security.SecureRandom;

public class ResetPassword {
    private static final int EXPIRATION_MINUTES = 5;
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generateRandomCode() {
        int code = 1000 + RANDOM.nextInt(9000);
        return  Integer.toString(code);
    }
    public static boolean isResetCodeValid(User user) {

            LocalDateTime creationTime = user.getCodeActivationDate();
            LocalDateTime expirationTime = creationTime.plusMinutes(EXPIRATION_MINUTES);
            return LocalDateTime.now().isBefore(expirationTime);

    }


}
