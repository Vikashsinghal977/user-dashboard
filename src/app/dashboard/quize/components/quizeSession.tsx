"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PageContainer from "@/components/layout/page-container";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What is the capital of India?",
    options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "2 + 2 equals?",
    options: ["3", "4", "5", "6"],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "Who is known as the Father of Computers?",
    options: ["Albert Einstein", "Charles Babbage", "Isaac Newton", "Alan Turing"],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "The chemical symbol 'O' stands for?",
    options: ["Oxygen", "Osmium", "Oxide", "Opal"],
    correctIndex: 0,
  },
  {
    id: 6,
    question: "Which is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
    correctIndex: 2,
  },
  {
    id: 7,
    question: "HTML stands for?",
    options: [
      "HyperText Markup Language",
      "HighText Machine Language",
      "Hyperlinking Text Management Language",
      "Home Tool Markup Language",
    ],
    correctIndex: 0,
  },
  {
    id: 8,
    question: "The smallest prime number is?",
    options: ["0", "1", "2", "3"],
    correctIndex: 2,
  },
  {
    id: 9,
    question: "Which gas is most abundant in Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctIndex: 2,
  },
  {
    id: 10,
    question: "Who wrote the Indian National Anthem?",
    options: ["Rabindranath Tagore", "Mahatma Gandhi", "Bankim Chandra Chatterjee", "Subhas Chandra Bose"],
    correctIndex: 0,
  },
];


export default function QuizeSession() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState(false);

  const current = sampleQuestions[index];
  const progress = (index / sampleQuestions.length) * 100;

  const handleAnswer = (i: number) => {
    setSelected(i);

    if (i === current.correctIndex) {
      setScore((s) => s + 1);
      setError(false);

      setTimeout(() => {
        if (index + 1 < sampleQuestions.length) {
          setIndex((idx) => idx + 1);
          setSelected(null);
        } else {
          setShowSummary(true);
        }
      }, 600);
    } else {
      setError(true);
    }
  };

  if (showSummary) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quiz Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-lg">
            Your Score:{" "}
            <span className="font-semibold">{score}</span> /{" "}
            {sampleQuestions.length}
          </p>
          <Button
            onClick={() => {
              setIndex(0);
              setScore(0);
              setShowSummary(false);
              setSelected(null);
              setError(false);
            }}
          >
            Reattempt Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <PageContainer scrollable>
        <div className="space-y-6">
            <Progress value={progress} className="mb-4" />
                <Card>
                    <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        Q{index + 1}. {current.question}
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                    {current.options.map((opt, i) => {
                        const isWrong = selected === i && error;
                        const isCorrect = selected === i && !error;

                        return (
                        <Button
                            key={i}
                            variant={isWrong ? "destructive" : isCorrect ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => handleAnswer(i)}
                        >
                            {opt}
                        </Button>
                        );
                    })}

                    {error && (
                        <p className="text-red-500 text-sm mt-2">❌ Wrong answer. Try again!</p>
                    )}
                    </CardContent>
                </Card>
        </div>
    </PageContainer>
  );
}
