import Image from 'next/image';

export const Logo = ({ logoUrl, height, width }: { logoUrl:string, height: number, width: number }) => {
    return (
        <Image
            src={logoUrl}
            alt='sierra-logo'
            height={height}
            width={width}
        />
    )
}