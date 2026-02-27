import { useMemo, useState } from 'react';

const starterTasks = [
  { id: 1, title: '朝のストレッチ5分', done: true, mood: '🙂' },
  { id: 2, title: 'お気に入りの飲み物を準備する', done: false, mood: '☕' },
  { id: 3, title: '今日やることを3つだけ書く', done: false, mood: '📝' }
];

const encouragement = [
  'いい感じ！小さな1歩が大きな変化になるよ。',
  '完璧じゃなくてOK。続けてることがすごい！',
  '今日は気分に合わせてゆるく進もう。',
  'やった分だけ前進。ちゃんと積み上がってる！'
];

function App() {
  const [tasks, setTasks] = useState(starterTasks);
  const [newTask, setNewTask] = useState('');

  const completedCount = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const todayMessage = encouragement[completedCount % encouragement.length];

  const addTask = (event) => {
    event.preventDefault();
    if (!newTask.trim()) {
      return;
    }

    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title: newTask.trim(), done: false, mood: '✨' }
    ]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-mood-peach to-mood-rose p-4 text-mood-plum">
      <section className="mx-auto max-w-xl rounded-3xl bg-white/85 p-6 shadow-soft backdrop-blur">
        <header className="mb-5">
          <p className="text-sm font-semibold text-purple-500">24歳・感覚派さん向け</p>
          <h1 className="text-3xl font-bold">やる気を育てるタスク管理アプリ</h1>
          <p className="mt-2 text-sm">気分が乗らない日でも、やさしく続けられる設計にしています。</p>
        </header>

        <div className="mb-6 rounded-2xl bg-mood-mint/70 p-4">
          <div className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>今日の達成度</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-purple-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-sm">{todayMessage}</p>
        </div>

        <form onSubmit={addTask} className="mb-4 flex gap-2">
          <input
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            placeholder="いまの気分でできそうなことを追加..."
            className="flex-1 rounded-xl border border-purple-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button
            type="submit"
            className="rounded-xl bg-purple-500 px-4 py-2 font-semibold text-white hover:bg-purple-600"
          >
            追加
          </button>
        </form>

        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between rounded-xl bg-purple-50 p-3">
              <button
                onClick={() => toggleTask(task.id)}
                className="flex flex-1 items-center gap-2 text-left"
                type="button"
              >
                <span>{task.mood}</span>
                <span className={task.done ? 'text-purple-300 line-through' : ''}>{task.title}</span>
              </button>
              <span className="text-sm font-semibold">{task.done ? '完了🎉' : 'これから'}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
