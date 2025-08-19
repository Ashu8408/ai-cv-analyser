import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";

import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume-lyzer" },
    { name: "description", content: "Voila!! your free AI resume analyser is here" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);     // a const of type array named Resume
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );

      console.log("parsedResumes = ", parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };

    loadResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section px-4 sm:px-6 lg:px-12">
        <div className="page-heading py-10 sm:py-16 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Track Your Applications & Resume Ratings
          </h1>
          <h2 className="text-base sm:text-lg lg:text-xl mt-2">
            Review your submissions and check AI-powered feedback.
          </h2>
        </div>

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4 px-4">
            <Link
              to="/upload"
              className="primary-button w-full sm:w-fit text-lg sm:text-xl font-semibold text-center"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
