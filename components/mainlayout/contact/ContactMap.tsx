const ContactMap = () => {
  return (
    <div className="mt-12 h-105 bg-fill-neutral md:mt-16 xl:mt-20 2xl:mt-24">
      <iframe
        title="BoroBazar office location on Google Maps"
        src="https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1sReseda,+California"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="size-full border-0"
      />
    </div>
  );
};

export default ContactMap;
