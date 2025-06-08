import { useState, useRef, useEffect } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import QuestionCard from "@/Components/QuestionCard";
import ReplyElement from "@/Components/ReplyElement";
import ForumLayout from "@/Layouts/ForumLayout";

export default function ViewProblem({question, threads, hasMore}) {
    const currentUser = usePage().props.auth.user;

    return (
        <AuthenticatedLayout
            title={"Question"}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Question
                </h2>
            }
        >
            <div className="mx-4 sm:mx-6 lg:mx-8 my-10">
                <ForumLayout endpoint={`/question/${question.id}`} user={question.user} threads={threads} hasMore={hasMore}>
                    <QuestionCard question={question} size="lg" liked={question.liked_users.includes(currentUser.id)}></QuestionCard>
                </ForumLayout>
            </div>
        </AuthenticatedLayout>
    );
}