import Image from "next/image"
import Link from "next/link"
import { SignUpForm } from "@/components/auth/signup-form"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Logo } from "@/components/shared/logo"

export default function SignupPage() {
  const bgImage = PlaceHolderImages.find(p => p.id === 'login-background');
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Logo className="justify-center mb-2" />
            <h1 className="text-3xl font-bold font-headline">Create an account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your information to create your HopOn account
            </p>
          </div>
          <SignUpForm />
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
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
        <div className="absolute bottom-8 left-8 right-8 bg-black/50 text-white p-6 rounded-lg backdrop-blur-sm">
          <blockquote className="text-lg font-semibold">
            "The journey of a thousand miles begins with a single step... or in our case, a single tap."
          </blockquote>
          <p className="mt-2 text-sm">- The HopOn Team</p>
        </div>
      </div>
    </div>
  )
}
