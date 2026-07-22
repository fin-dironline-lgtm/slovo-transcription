"use client";

import { useMemo, useRef, useState } from "react";

type Job = { id: number; title: string; meta: string; status: "ready" | "processing"; progress?: number; duration: string };

const initialJobs: Job[] = [
  { id: 1, title: "Еженедельный синк команды", meta: "Сегодня, 10:32 · Zoom", status: "ready", duration: "1:18:42" },
  { id: 2, title: "Интервью с клиентом — Анна", meta: "Вчера · Google Meet", status: "processing", progress: 68, duration: "54:09" },
  { id: 3, title: "Product review · 18 июля", meta: "18 июля · Teams", status: "ready", duration: "2:04:17" },
];

const transcript = [
  { time: "00:00", who: "Илья", color: "violet", text: "Всем привет! Предлагаю начать с результатов прошлой недели, а затем пройтись по блокерам." },
  { time: "00:13", who: "Марина", color: "amber", text: "Да, давайте. По онбордингу мы закончили первый сценарий и уже передали его в разработку. Остался вопрос с письмами." },
  { time: "00:31", who: "Илья", color: "violet", text: "Отлично. По срокам мы всё ещё укладываемся в запуск до конца месяца?" },
  { time: "00:39", who: "Марина", color: "amber", text: "Если согласуем тексты сегодня, то да. Я добавила варианты в документ и отмечу там Олега." },
  { time: "00:54", who: "Олег", color: "blue", text: "Посмотрю до обеда. Ещё предлагаю отдельно проверить мобильную версию — там были расхождения с макетами." },
];

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [jobs, setJobs] = useState(initialJobs);
  const [active, setActive] = useState(1);
  const [query, setQuery] = useState("");
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState<"text" | "summary">("text");
  const current = jobs.find((j) => j.id === active) ?? jobs[0];

  const filtered = useMemo(() => transcript.filter((line) => `${line.who} ${line.text}`.toLowerCase().includes(query.toLowerCase())), [query]);

  function addFile(file?: File) {
    if (!file) return;
    const title = file.name.replace(/\.[^.]+$/, "");
    setJobs((items) => [{ id: Date.now(), title, meta: "Только что · Загрузка", status: "processing", progress: 12, duration: "—" }, ...items]);
    setToast("Видео добавлено в очередь");
    setTimeout(() => setToast(""), 2600);
  }

  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 2400);
  }

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => setActive(1)} aria-label="На главную"><span className="brandMark">T</span><span>Слово</span></button>
        <nav aria-label="Основная навигация"><button className="navActive">Записи</button><button onClick={() => notify("Раздел команды скоро будет доступен")}>Команда</button></nav>
        <div className="headerActions"><button className="help" aria-label="Помощь">?</button><button className="avatar" aria-label="Профиль">ЕМ</button></div>
      </header>

      <section className="workspace">
        <aside className="library">
          <div className="libraryHead"><div><p className="eyebrow">РАБОЧЕЕ ПРОСТРАНСТВО</p><h1>Мои записи</h1></div><button className="addButton" onClick={() => inputRef.current?.click()} aria-label="Добавить видео">＋</button></div>
          <label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Найти запись" /></label>
          <div className="jobList">
            {jobs.map((job) => <button key={job.id} className={`job ${active === job.id ? "selected" : ""}`} onClick={() => setActive(job.id)}>
              <span className="jobTop"><strong>{job.title}</strong><span>{job.duration}</span></span>
              <span className="jobMeta">{job.meta}</span>
              {job.status === "processing" && <span className="progressRow"><i><b style={{ width: `${job.progress}%` }} /></i><em>{job.progress}%</em></span>}
            </button>)}
          </div>
          <div className="usage"><div><span>Использовано в этом месяце</span><strong>4 ч 17 мин <small>из 10 ч</small></strong></div><i><b /></i><button onClick={() => notify("Тарифы откроются в следующей версии")}>Увеличить лимит →</button></div>
        </aside>

        <section className="content">
          <div className="contentHead"><div><p className="breadcrumb">Записи / {current.title}</p><h2>{current.title}</h2><p>{current.meta} · Русский язык</p></div><div className="contentActions"><button className="iconButton" onClick={() => notify("Ссылка скопирована")}>↗ <span>Поделиться</span></button><button className="export" onClick={() => notify("Экспорт подготовлен")}>⇩ Экспорт</button><button className="iconButton dots" aria-label="Ещё">•••</button></div></div>

          <div className="player">
            <div className="videoMock"><div className="meetingGrid"><span className="person p1">ИЛ</span><span className="person p2">М</span><span className="person p3">О</span><span className="person p4">АК</span></div><span className="liveBadge">ЗАПИСЬ ВСТРЕЧИ</span></div>
            <div className="controls"><button aria-label="Воспроизвести">▶</button><span>00:39</span><i><b /></i><span>{current.duration}</span><button className="speed">1×</button><button aria-label="Громкость">◖</button><button aria-label="На весь экран">⌗</button></div>
          </div>

          <div className="tabs"><button className={tab === "text" ? "active" : ""} onClick={() => setTab("text")}>Расшифровка</button><button className={tab === "summary" ? "active" : ""} onClick={() => setTab("summary")}>Краткое содержание <span>AI</span></button><label className="insideSearch"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по тексту" /></label></div>

          {tab === "text" ? <div className="transcript">
            {filtered.length ? filtered.map((line, index) => <article className="line" key={`${line.time}-${index}`}><button className="timestamp">{line.time}</button><span className={`speaker ${line.color}`}>{line.who.slice(0, 1)}</span><div><strong>{line.who}</strong><p>{line.text}</p></div><button className="lineMore" aria-label="Действия">•••</button></article>) : <div className="empty">Ничего не найдено</div>}
          </div> : <div className="summary"><div className="summaryIntro"><span>✦</span><div><h3>Встреча за минуту</h3><p>Команда успевает запустить обновлённый онбординг до конца месяца. Для этого сегодня нужно согласовать тексты писем и проверить мобильную версию.</p></div></div><h3>Что решили</h3><ul><li>Передать финальные тексты Олегу до обеда.</li><li>Отдельно проверить расхождения мобильной версии с макетами.</li><li>Сохранить плановую дату запуска в конце месяца.</li></ul><h3>Следующие шаги</h3><div className="task"><input type="checkbox" /> <span><strong>Олег</strong> — проверить тексты писем</span><time>Сегодня</time></div><div className="task"><input type="checkbox" /> <span><strong>Марина</strong> — организовать проверку мобильной версии</span><time>Завтра</time></div></div>}
        </section>
      </section>

      <input ref={inputRef} type="file" accept="video/*,audio/*" hidden onChange={(e) => addFile(e.target.files?.[0])} />
      <button className={`dropZone ${dragging ? "dragging" : ""}`} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); addFile(e.dataTransfer.files[0]); }} onClick={() => inputRef.current?.click()}><span>＋</span><strong>Перетащите видео сюда</strong><small>или нажмите, чтобы выбрать файл до 10 ГБ</small></button>
      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}
