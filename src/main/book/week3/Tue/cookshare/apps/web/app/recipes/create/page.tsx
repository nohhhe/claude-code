'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Navbar } from '../../../components/shared/navbar';
import { Plus, X } from 'lucide-react';

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface Instruction {
  step: number;
  instruction: string;
}

export default function CreateRecipePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('쉬움');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: '' }
  ]);
  const [instructions, setInstructions] = useState<Instruction[]>([
    { step: 1, instruction: '' }
  ]);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = ingredients.map((ingredient, i) => 
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    setIngredients(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, { step: instructions.length + 1, instruction: '' }]);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      const updated = instructions.filter((_, i) => i !== index)
        .map((instruction, i) => ({ ...instruction, step: i + 1 }));
      setInstructions(updated);
    }
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = instructions.map((instruction, i) => 
      i === index ? { ...instruction, instruction: value } : instruction
    );
    setInstructions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 레시피 저장 로직 구현
    console.log('레시피 저장:', {
      title,
      description,
      prepTime: parseInt(prepTime),
      cookTime: parseInt(cookTime),
      servings: parseInt(servings),
      difficulty,
      ingredients,
      instructions
    });
    alert('레시피가 저장되었습니다!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">새 레시피 등록</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 - 간소화된 레이아웃 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">레시피 제목 *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 김치찌개"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">설명</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="집에서 만드는 정통 김치찌개. 시원하고 칼칼한 맛이 일품입니다."
                  rows={2}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">준비시간 (분)</label>
                  <input
                    type="number"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="10"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">조리시간 (분)</label>
                  <input
                    type="number"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    placeholder="20"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">인분</label>
                  <input
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    placeholder="4"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">난이도</label>
                <div className="flex gap-2">
                  {['쉬움', '보통', '어려움'].map((level) => (
                    <Button
                      key={level}
                      type="button"
                      variant={difficulty === level ? 'default' : 'outline'}
                      onClick={() => setDifficulty(level)}
                      className="flex-1 text-sm h-9"
                      size="sm"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* 재료 */}
            <div>
              <label className="block text-sm font-medium mb-3">재료</label>
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 items-center">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      placeholder="재료명"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                    />
                    <input
                      type="text"
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                      placeholder="분량"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                        placeholder="단위"
                        className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addIngredient}
                        className="px-2"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      {ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeIngredient(index)}
                          className="px-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 조리과정 */}
            <div>
              <label className="block text-sm font-medium mb-3">조리과정</label>
              <div className="space-y-3">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <Badge variant="outline" className="mt-2 min-w-[30px] h-7 text-xs justify-center">
                      {instruction.step}
                    </Badge>
                    <div className="flex-1">
                      <textarea
                        value={instruction.instruction}
                        onChange={(e) => updateInstruction(index, e.target.value)}
                        placeholder="조리 과정을 설명해주세요"
                        rows={2}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                      />
                    </div>
                    <div className="flex gap-1 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addInstruction}
                        className="px-2 h-7"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      {instructions.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeInstruction(index)}
                          className="px-2 h-7"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-center pt-4">
              <Button type="submit" className="w-full h-11">
                레시피 등록하기
              </Button>
            </div>
            
            {/* 추가 옵션 링크 */}
            <div className="text-center text-sm text-muted-foreground">
              <Link href="/recipes" className="hover:text-primary">
                나중에 등록하고 레시피 둘러보기
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}