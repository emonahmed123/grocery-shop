/** White card for the dashboard's single-form pages (profile, password). */
const SettingsCard = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-3xl rounded-lg border bg-background p-5 sm:p-7">{children}</div>
);

export default SettingsCard;
