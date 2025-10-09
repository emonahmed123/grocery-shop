import Image from "next/image";

const AboutDetails = () => {
  return (
    <section className="py-8 lg:py-16 2xl:py-20">
      <div className="mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 2xl:px-10">
        <div className="flex flex-col w-full mx-auto max-w-[1200px]">
          <h2 className="text-lg md:text-xl lg:text-[24px] text-brand-dark font-semibold mb-4 lg:mb-7">
            About us
          </h2>

          <div className="text-sm leading-7 text-brand-dark opacity-70 lg:text-15px lg:leading-loose">
            <p>
              We may automatically track certain information about you based
              upon your behavior on the website. We use this information to do
              internal research on our users’ demographics, interests, and
              behavior to better understand, protect and serve our users. This
              information is compiled and analyzed on an aggregated basis. This
              information may include the URL that you just came from (whether
              this URL is on the website or not), which URL you next go to
              (whether this URL is on the website or not), your computer browser
              information, your IP address, and other information associated
              with your interaction with the website.{" "}
            </p>
            <strong>
              We may also share your Mobile IP/Device IP with third party(ies)
              and to the best of our knowledge, be-life and representations
              given to us by these third party(ies) this information is not
              stored.
            </strong>

            <p>
              Our Privacy Policy is incorporated into the Terms and Conditions
              of Use of the website/app, and is subject to change from time to
              time without notice. It is strongly recommended that you
              periodically review our Privacy Policy as posted on the App/Web.
            </p>
            <p>
              <a
                className="text-[#02b290] font-semibold"
                href="mailto:imonshomon@gmail.com"
              >
                imonshomon@gmail.com
              </a>
              Should you have any clarifications regarding this Privacy Policy,
              please do not hesitate to contact us at{" "}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 my-8 lg:my-14">
            <Image
              width={590}
              height={400}
              src="https://borobazar.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F1.07d7bc61.png&w=640&q=75"
              alt="png"
            />
            <Image
              width={590}
              height={400}
              src="https://borobazar.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F2.3f856ddb.png&w=640&q=75"
              alt="png"
            />
          </div>

          <div className="text-sm leading-7 text-brand-dark opacity-70 lg:text-15px lg:leading-loose">
            <p>
              To protect against the loss, misuse and alteration of the
              information under its control, the Company has in place
              appropriate physical, electronic and managerial procedures. For
              example, the Company servers are accessible only to authorized
              personnel and your information is shared with employees and
              authorized personnel on a need to know basis to complete the
              transaction and to provide the services requested by you. Although
              the Company endeavour to safeguard the confidentiality of your
              personally identifiable information, transmissions made by means
              of the Internet cannot be made absolutely secure. By using the
              website, you agree that the Company will have no liability for
              disclosure of your information due to errors in transmission
              and/or unauthorized acts of third parties.
            </p>

            <p>
              Please note that the Company will not ask you to share any
              sensitive data or information via email or telephone. If you
              receive any such request by email or telephone, please do not
              respond/divulge any sensitive data or information and forward the
              information relating to the same to{" "}
              <a href="mailto:imonshomon@gmail.com">imonshomon@gmail.com</a>
            </p>
          </div>

          <div className="flex flex-col grid-cols-3 gap-4 my-8 lg:my-14 sm:grid">
            <Image
              width={390}
              height={270}
              src="https://borobazar.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F3.39e1c1b6.png&w=640&q=75"
              alt="png"
            />
            <Image
              width={390}
              height={270}
              src="https://borobazar.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F4.a18c699b.png&w=640&q=75"
              alt="png"
            />
            <Image
              width={390}
              height={270}
              src="https://borobazar.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F5.6643c8bf.png&w=640&q=75"
              alt="png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutDetails;
