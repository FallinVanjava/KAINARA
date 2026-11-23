'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginSchema, type LoginInput } from '@/lib/validators/auth';
import { signInAdmin } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlErrorParam = searchParams.get('error');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    if (urlErrorParam === 'unauthorized') return 'Akun ini tidak memiliki akses admin.';
    if (urlErrorParam === 'inactive') return 'Akun administrator ini telah dinonaktifkan.';
    if (urlErrorParam === 'no_profile') return 'Profil akun tidak ditemukan.';
    return null;
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setErrorMessage(null);
    try {
      const res = await signInAdmin(data);
      if (!res.success) {
        setErrorMessage(res.error || 'Email atau kata sandi salah.');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setErrorMessage('Terjadi gangguan jaringan. Coba lagi.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive font-medium leading-relaxed"
        >
          {errorMessage}
        </div>
      )}

      {/* Field Email */}
      <div className="space-y-1.5 text-left">
        <Label htmlFor="email" className="text-xs font-semibold text-[#5E0F11] dark:text-[#F6E9DC]">
          Alamat Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="admin@kainara.id"
          disabled={isSubmitting}
          className="h-11 rounded-xl border-[#E8D8C8] bg-white text-sm dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-[11px] text-destructive font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Field Password */}
      <div className="space-y-1.5 text-left">
        <Label htmlFor="password" className="text-xs font-semibold text-[#5E0F11] dark:text-[#F6E9DC]">
          Kata Sandi
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={isSubmitting}
            className="h-11 rounded-xl border-[#E8D8C8] bg-white pr-10 text-sm dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A3A3A] hover:text-[#5E0F11] dark:text-[#D9C3B5] dark:hover:text-[#F6E9DC]"
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-[11px] text-destructive font-medium">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Tombol Masuk */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-full bg-[#7A1212] text-sm font-bold text-[#FFF8F0] shadow-sm hover:bg-[#5E0F11] focus-visible:ring-2 focus-visible:ring-[#96640F] transition-all disabled:opacity-70 dark:bg-[#8F1A1A] dark:hover:bg-[#7A1212]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Memverifikasi...
          </>
        ) : (
          'Masuk ke Panel Admin'
        )}
      </Button>
    </form>
  );
}
