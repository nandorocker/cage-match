export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-14 py-6 px-4 text-center text-sm text-muted-foreground">
      <p>© {currentYear} <a href="https://nan.do" target="_blank">Nando Rossi</a>, all rights reserved. • <a href="#">Privacy Policy</a> • Thanks to <a href="https://www.richardranks.com/2024/07/unlocking-cage-nicolas-cage-films-ranked.html?m=1" target="_blank">Richard</a> for the original rankings.</p>
    </footer>
  );
} 