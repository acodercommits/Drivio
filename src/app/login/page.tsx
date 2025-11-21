import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LoginPage() {
    const bgImage = PlaceHolderImages.find(p => p.id === 'login-background');
    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold font-headline">Welcome Back</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <LoginForm />
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative">
                {bgImage && (
                    <Image
                        src={bgImage.imageUrl}
                        alt={bgImage.description}
                        data-ai-hint={bgImage.imageHint}
                        fill
                        className="object-cover"
                    />
                )}
            </div>
        </div>
    );
}
