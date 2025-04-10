'use client';

import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Vérifiez votre email
          </h2>
          <div className="mt-4 text-gray-600">
            <p>Un email de confirmation a été envoyé à votre adresse.</p>
            <p className="mt-2">
              Veuillez cliquer sur le lien dans l&apos;email pour activer votre compte.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/auth/login"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Retour à la page de connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
