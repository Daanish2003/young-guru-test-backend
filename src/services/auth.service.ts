import 'dotenv/config'
import { fakeOTPStore } from "#config/auth.config.js";
import { prisma } from "#models/client.js";
import { LevelEnum } from "#models/generated/prisma/enums.js";
import { JWTPayload, jwtVerify, SignJWT } from "jose";

export type SessionPayload = {
    id: string,
    phone: string,
    level: LevelEnum
}

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

function isSessionPayload(payload: JWTPayload): payload is SessionPayload {
  return (
    typeof payload.id === "string" &&
    typeof payload.phone === "string" &&
    typeof payload.level === "string"
  );
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1hr')
    .sign(key);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });

    if (isSessionPayload(payload)) {
      return payload;
    }

    return null
  } catch (error) {
    return null;
  }
}

export const verifyOtp = (phoneNumber: string, otp: string) => {
  const storedOtp = fakeOTPStore[phoneNumber];

  if (!storedOtp) {
    return {
      success: false,
      error: "Phone number not allowed"
    };
  }

  if (storedOtp !== otp) {
    return {
      success: false,
      error: "Invalid OTP"
    };
  }

  return {
    success: true,
    message: "OTP verified"
  };
};

export const getExistingUser = async (phoneNumber: string) => {
    return await prisma.user.findUnique({
        where: {
            phone: phoneNumber
        },
        select: {
            id: true,
            level: true,
            phone: true
        }
    })
}

export const createNewUser = async (phoneNumber: string) => {
    return await prisma.user.create({
        data: {
            phone: phoneNumber,
        },
        select: {
            id: true,
            level: true,
            phone: true,
        }
    })
}

export const generateJWT = async (newUser: { id: string, phone: string, level: LevelEnum}) => {
    const encryptedData = await encrypt(newUser)

    return encryptedData
}

export const saveLoginInfo = async ({
  userId,
  ipAddress
  } : { 
    userId: string
    ipAddress: string
  }) => {
    return await prisma.login.create({
      data: {
        user_id: userId,
        ip_address: ipAddress,
      }
    })
}

export const verifyJWT = async (token: string) => {
  const decryptedData = await decrypt(token)

  return decryptedData
}
