export interface ModemDoc {
    name: string;
    connectionType: string;
    image: string;
    loginImage: string;
    description: string;
    credentials: {
        ipAddress: string;
        username: string;
        password: string;
        defaultSuperAdminPass?: string;
    };
    networkConfig: {
        wanConfigImage: string[];
        wifi: {
            configImages: string[];
            defaultSSID: string;
            defaultPassword: string;
        },
    },
    managementConfigImages?: string[];
    tutorialVideoUrl?: string;
    slug: string;
}

export const modemDocs : ModemDoc[] = [
    {
        name: 'FiberHome GPON ONU (IOT) HG6245D',
        connectionType: "GPON",
        image: '/images/modems/iot/iot.png',
        loginImage: '/images/modems/iot/iot-login.png',
        description: 'Gpon line ang IOT na modem. Take note kapag na reset, ilagay lng ang default superadmin pass sa password field.',
        credentials: {
            ipAddress: '192.168.1.1',
            username: 'admin',
            password: 'admin1234',
            defaultSuperAdminPass: '%0|F?H@f!berhO3e'
        },
        networkConfig: {
            wanConfigImage: [
                '/images/modems/iot/iot-wan-config.png'
            ],
            wifi: {
                configImages: [
                    '/images/modems/iot/iot-ssid1-config.png',
                    '/images/modems/iot/iot-ssid5-config.png'
                ],
                defaultSSID: 'SierraNet / SierraNet-5G',
                defaultPassword: 'eeeeeeee'
            }
        },
        managementConfigImages: ["/images/modems/iot/iot-management-root.png", "/images/modems/iot/iot-management-admin.png"],
        slug: 'iot-HG6245D'
    },
    {
        name: 'Huawei 5V5',
        connectionType: "EPON / GPON",
        image: '/images/modems/5v5/5v5.png',
        loginImage: '/images/modems/5v5/5v5-login.png',
        description: 'Ang 5V5 Huawei modem ay kadalasan ginagamit natin sa EPON line kapag ito ay naka flash na sa epon. Pero pwede rin siyang gamitin sa GPON line kapag i reset.',
        credentials: {
            ipAddress: '192.168.100.1',
            username: '"telecomadmin" - (superadmin) or "root" - (user access)',
            password: 'admintelecom - (superadmin) or "admin" - (user access)',
            defaultSuperAdminPass: 'admintelecom'
        },
        networkConfig: {
            wanConfigImage: [
                '/images/modems/5v5/5v5-wan-config.png'
            ],
            wifi: {
                configImages: [
                    '/images/modems/5v5/5v5-ssid1-config.png',
                    '/images/modems/5v5/5v5-ssid5-config.png'
                ],
                defaultSSID: 'SierraNet / SierraNet-5G',
                defaultPassword: 'eeeeeeee'
            }
        },
        tutorialVideoUrl: '/videos/5v5-modem-flashing.mp4',
        slug: '5v5-Huawei'
    },
    {
        name: 'XPON (Apat Sungay)',
        connectionType: "EPON / GPON",
        image: '/images/modems/xpon-apat-sungay/xpon-4sungay.png',
        loginImage: '/images/modems/xpon-apat-sungay/xpon-login.png',
        description: 'Ang Modem na ito ay pwede gamitin sa EPON at GPON Line. Vlan Tag kapag GPON tapos VLan Untag kapag EPON.',
        credentials: {
            ipAddress: '192.168.1.1',
            username: 'admin',
            password: 'Admin123',
            defaultSuperAdminPass: 'Admin123'
        },
        networkConfig: {
            wanConfigImage: [
                '/images/modems/xpon-apat-sungay/xpon-wan-config.png',
                '/images/modems/xpon-apat-sungay/xpon-wan-config2.png',
            ],
            wifi: {
                configImages: [
                    '/images/modems/xpon-apat-sungay/xpon-ssid1-config.png',
                    '/images/modems/xpon-apat-sungay/xpon-ssid5-config.png'
                ],
                defaultSSID: 'SierraNet / SierraNet-5G',
                defaultPassword: 'eeeeeeee'
            }
        },
        slug: 'xpon-apatsungay'
    },
    {
        name: 'XPON (2 Sungay)',
        connectionType: "EPON / GPON",
        image: '/images/modems/xpon-2-sungay/xpon-2sungay.png',
        loginImage: '/images/modems/xpon-2-sungay/xpon-2sungay-login.png',
        description: 'Ang Modem na ito ay pwede gamitin sa EPON at GPON Line. Vlan Tag kapag GPON tapos VLan Untag kapag EPON.',
        credentials: {
            ipAddress: '192.168.1.1',
            username: 'root',
            password: 'admin',
            defaultSuperAdminPass: 'admin'
        },
        networkConfig: {
            wanConfigImage: [
                '/images/modems/xpon-2-sungay/xpon2-wan-config.png',
                '/images/modems/xpon-2-sungay/xpon2-wan-config2.png',
            ],
            wifi: {
                configImages: [
                    '/images/modems/xpon-2-sungay/xpon2-ssid1-config.png',
                    '/images/modems/xpon-2-sungay/xpon2-ssid5-config.png'
                ],
                defaultSSID: 'SierraNet / SierraNet-5G',
                defaultPassword: 'eeeeeeee'
            }
        },
        slug: 'xpon-2sungay'
    }
]