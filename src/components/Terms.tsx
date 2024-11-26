import React from 'react';
import { Container, Typography, Box, Grid, Paper, Button, AppBar, Toolbar } from '@mui/material';
import { styled, useMediaQuery } from '@mui/system';

// Styled components for enhanced look
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(https://via.placeholder.com/1200x500)', // Replace with your image URL
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(2, 2),
  textAlign: 'center',
}));

const AboutSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2),
  //   backgroundColor: theme.palette.grey[100],
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  //   boxShadow: theme.shadows[3],
  //   '&:hover': {
  //     boxShadow: theme.shadows[6],
  //   },
}));







const Terms = () => {

  const isMobile = useMediaQuery('(max-width:600px)');
  const [type, setType] = React.useState<string>("Terms of Use");


  return (
    <>


      <Box >

        <Toolbar
          sx={{
            justifyContent: 'center',
            gap: 3, // Adds spacing between buttons
          }}
        >
          <Button
            sx={{
              fontSize: '15px',
              color: type === "Terms of Use" ? '#ffffff' : '#333333',
              backgroundColor: type === "Terms of Use" ? 'rgba(128, 128, 128, 0.5)': 'transparent',
              '&:hover': {
                backgroundColor: type === "Terms of Use" ? 'rgba(128, 128, 128, 0.7)' : '#e0e0e0', // Slightly different hover effect for selected
              },
            }}
            onClick={() => setType("Terms of Use")}
          >
            Terms of Use
          </Button>
          <Button
            sx={{
              fontSize: '15px',
              color: type === "Privacy Policy" ? '#ffffff' : '#333333',
              backgroundColor: type === "Privacy Policy" ? 'rgba(128, 128, 128, 0.5)' : 'transparent',
              '&:hover': {
                backgroundColor: type === "Privacy Policy" ? 'rgba(128, 128, 128, 0.7)' : '#e0e0e0',
              },
            }}
            onClick={() => setType("Privacy Policy")}
          >
            Privacy Policy
          </Button>
          <Button
            sx={{
              fontSize: '15px',
              color: type === "Take Down Policy" ? '#ffffff' : '#333333',
              backgroundColor: type === "Take Down Policy" ? 'rgba(128, 128, 128, 0.5)' : 'transparent',
              '&:hover': {
                backgroundColor: type === "Take Down Policy" ? 'rgba(128, 128, 128, 0.7)' : '#e0e0e0',
              },
            }}
            onClick={() => setType("Take Down Policy")}
          >
            Take Down Policy
          </Button>
        </Toolbar>

      </Box>









      {type == "Terms of Use" && (
        <AboutSection sx={{ width: isMobile ? '95%' : '75%', margin: '0 auto' }}>


          <Typography variant="h4" gutterBottom align="center">
            Terms of Use
          </Typography>
          <Typography variant="body1" paragraph align="left">
            Please read these Terms of Use (the &quot;Agreement&quot; or &quot;Terms of Use&quot;) carefully before using the
            services known as Surfpik, offered by Picawave, LLC (the “Company”). This Agreement sets forth the
            legally binding terms and conditions for your use of the website at www.surfpik.com, all other sites
            owned and operated by The Company that redirect to www.surfpik.com, and all subdomains
            (collectively, the “Website”), and the service owned and operated by the Company, known as
            Surfpik (together with the Website, the “Service” or “Surfpik”). By using the Service in any manner,
            including, but not limited to, visiting or browsing the Website or contributing content, information,
            or other materials or services to the Website, you agree to be bound by this Agreement. <br /><br />

            The Service is offered as a platform enabling an individual, entity or an organization (the
            “Photographer”) to create a Photographer Page (“Photographer Page”) to which the Photographer
            may upload, offer, share and sell copies of photographs and/or videos and/or footage and/or other
            media (“Visual Materials”) taken, edited or created by the Photographer to surfers (“Surfers”) that
            were captured in the offered Visual Materials. The Service include features to facilitate payments,
            revenue predictions, marketing and community engagement.<br /><br />

            The Service is offered subject to acceptance of all of the terms and conditions contained in these
            Terms of Use, including the Privacy Policy available at https://www.surfpik.com/Terms, and all
            other operating rules, policies, and procedures that may be published on the Website by the
            Company, which are incorporated by reference. These Terms of Use apply to every user of the
            Service. In addition, some features offered through the Service may be subject to additional terms
            and conditions adopted by the Company. Your use of those features is subject to those additional
            terms and conditions, which are incorporated into these Terms of Use by this reference.<br /><br />

            The Company reserves the right, at its sole discretion, to modify or replace these Terms of Use by
            posting the updated terms on the Website. It is your responsibility to check the Terms of Use
            periodically for changes. Your continued use of the Service following the posting of any changes to
            the Terms of Use constitutes acceptance of those changes.<br /><br />

            The Company reserves the right to change, suspend, or discontinue the Service (including, but not
            limited to, the availability of any feature, database, or Content) at any time for any reason. The
            Company may also impose limits on certain features and services or restrict your access to parts or
            all of the Service without notice or liability.<br /><br />

            The Service is available only to individuals who are at least 16 years old (and at least the legal age in
            your jurisdiction). You represent and warrant that if you are an individual, you are at least 16 years
            old and of legal age in your jurisdiction to form a binding contract, and that all registration
            information you submit is accurate and truthful. The Company reserves the right to ask for proof of
            age from you and your account may be suspended until satisfactory proof of age is provided. The
            Company may, in its sole discretion, refuse to offer the Service to any person or entity and change its
            eligibility criteria at any time. This provision is void where prohibited by law and the right to access
            the Service is revoked in those jurisdictions.<br /><br />

            1. Account Registration<br /><br />

            As a Surfer, You can browse the Website without registering for an account. However, in order to
            buy a Visual Material, and to use some of our features, you may be required to register and account
            and create a membership (“Membership”). When you do so, the information you give us has to be
            accurate and complete. You shall not register a username, or Photographer Page any name or term
            that (i) is the name of another person, with the intent to impersonate that person; (ii) is subject to
            any rights of another person, without appropriate authorization; or (iii) is offensive, vulgar, or

            obscene. The Company reserves the right in its sole discretion to refuse registration of or cancel a
            User ID, domain name, and project name. You are solely responsible for activity that occurs on your
            account and shall be responsible for maintaining the confidentiality of your password for the
            Website. You shall never use another User account without the other User’s express permission. You
            will immediately notify the Company in writing of any unauthorized use of your account, or other
            known account-related security breach.<br /><br />

            Additionally, you shall not: (i) take any action that imposes or may impose (as determined by the
            Company in its sole discretion) an unreasonable or disproportionately large load on the Company’s
            or its third-party providers’ infrastructure; (ii) interfere or attempt to interfere with the proper
            working of the Service or any activities conducted on the Service; (iii) bypass any measures the
            Company may use to prevent or restrict access to the Service (or other accounts, computer systems,
            or networks connected to the Service); (iv) run Maillist, Listserv, or any form of auto-responder or
            &quot;spam&quot; on the Service; or (v) use manual or automated software, devices, or other processes to
            &quot;crawl&quot; or &quot;spider&quot; any page of the Website.<br /><br />

            You shall not directly or indirectly: (i) decipher, decompile, disassemble, reverse engineer, or
            otherwise attempt to derive any source code or underlying ideas or algorithms of any part of the
            Service, except to the extent applicable laws specifically prohibit such restriction; (ii) modify,
            translate, or otherwise create derivative works of any part of the Service; or (iii) copy, rent, lease,
            distribute, or otherwise transfer any of the rights that you receive hereunder. You shall abide by all
            applicable local, state, national, and international laws and regulations.<br /><br />

            Surfers may only purchase Visual Materials in which they are featured, captured or appear, or Visual
            Materials where a third party is featured, captured or appear and such third party has provided its
            consent to a Surfer to purchase such Visual Materials; Surfers are not entitled to purchase other
            Visual Materials. The Company may take reasonable actions to verify the identity of a Surfer before
            selling such Surfer a Visual Material.<br /><br />

            2. Service Terms <br /><br />

            By becoming a Photographer, you are offering Surfers the opportunity to buy Visual Materials
            provided by you. By becoming a Surfer on the Website, you become a potential buyer of Visual
            Materials provided by Photographers. All commercial terms in respect of purchasing Visual Materials
            are to be published on the applicable Photographer Page.<br /><br />

            The Company is not liable for any damages or loss incurred related to the use of the Service. The
            Company is under no obligation to become involved in disputes between Surfers, or between Surfers
            and Photographers arising in connection with the use of the Service, unless such disputes arose in
            connection with the Company’s obligations hereunder. The Company does not oversee the
            performance or punctuality of offerings by Photographers. The Company does not endorse any User
            Submission (as defined below).<br /><br />

            3. Photographers’ Terms <br /><br />

            A Photographer is someone who creates a page on Surfpik to offer the sale of Visual Materials and
            engage with Surfers through such Photograph’s page (“Photographer’s Page”). When you become a
            Photographer and offer Surfers with Visual Materials, the following rules apply (in addition to all
            other Terms herein):<br /><br />

            a. You are required to timely fulfil the obligations specified in the Photographer’s Page.<br /><br />


            b. Respond promptly and truthfully to all questions posed in comments, messages, or updates
            including any questions or requests the Company makes to verify ability to fulfil. If you are
            unresponsive or if a dispute arises between you and Surfers, we may provide your name,
            legal mailing address and email address to your Surfers, or in the instances where the law
            requires it.<br /><br />

            c. If you have received payment from Surfers but are unable to deliver the associated good or
            service, or if otherwise requested by the Company in accordance with the Company’s refund
            policy, issue refunds to such Surfers. Please remember that as a Photographer, you are
            solely responsible for fulfilling the obligations of your Photographer’s Page. If you are unable
            to perform on this, or any of your other legal obligations, you may be subject to legal action
            by Surfers. Your legal mailing address and contact information may be shared with Surfers
            seeking legal action.<br /><br />

            d. Comply with all applicable laws and regulations in statements concerning your Membership
            and Photographer’s Page, the use of goods and services and delivery of such.<br /><br />

            e. Photographer’s should be ready, willing, and able to substantiate claims it makes, including
            but not limited to product features and capabilities, and timelines for delivery if requested. If
            you are unable to uphold claims, the Company may terminate your account, withhold funds,
            provide your name, mailing and email address, or take other actions to enforce its rights
            under this Agreement and applicable law.<br /><br />

            f. When you use the Services by creating a Photographer’s Page, you may receive information
            about Surfers that have become the Company’s clients, including personally identifiable
            information (“Personal Information”), such as names, e-mail addresses, and physical
            addresses. This Personal Information is provided to you purely for the purpose of fulfilling
            the Services, and may not be used or disclosed for any other purposes, including cross-
            promotional marketing of any other products including your own other products, without
            separate, verifiable consent from the User obtained independently from Surpic. You will
            maintain, and be required to produce if requested, records of all such verifiable consent.<br /><br />

            g. You are required to provide Visual Materials in a customary readable form.
            h. By Selling Virtual Materials, you unconditional waive any moral rights associated with such
            Virtual Materials, to include all rights of paternity, integrity, disclosure and withdrawal and
            any other rights that may be known as or referred to as “Moral Rights” (collectively, “Moral
            Rights”). To the extent such Moral Rights cannot be assigned under applicable law and to
            the extent the following is allowed by the law in the various countries where Moral Rights
            exist, the Photographer hereby waives such Moral Rights and consents to any action of the
            Company or the applicable Surfer that would violate such Moral Rights in the absence of
            such consent.<br /><br />

            As a Photographer, you undertake not to use Surfpik for any purpose that is prohibited by the Terms
            of Use or applicable law. You are responsible for all of your activity in connection with the Service.
            You shall not, and shall not permit any third party using your account to, take any action, or submit
            content in any context, that:<br /><br />

            a. infringes any patent, trademark, trade secret, copyright, right of publicity, or other right of
            any other person or entity, or violates any law or contract;<br />

            b. you know is false, misleading, or inaccurate;<br />

            c. is unlawful, threatening, abusive, harassing, defamatory, libelous, deceptive, fraudulent,
            tortious, obscene, offensive, profane, or invasive of another&#39;s privacy;<br />

            d. constitutes unsolicited or unauthorized advertising or promotional material or any junk mail,
            spam, or chain letters;<br />

            e. contains software viruses or any other computer codes, files, or programs that are designed
            or intended to disrupt, damage, limit, or interfere with the proper function of any software,
            hardware, or telecommunications equipment or to damage or obtain unauthorized access to
            any system, data, password, or other information of the Company or any third party;<br />

            f. is made in breach of any legal duty owed to a third party, such as a contractual duty or a
            duty of confidence; or<br />

            g. impersonates any person or entity, including any employee or representative of the
            Company.<br /><br />

            4. Surfers’ Terms<br /><br />
            A Surfer is someone who has registered a Membership for the purpose of having the possibility to
            purchase Visual Materials from Photographers. When you become a Surfer and purchase Visual
            Materials, the following rules apply (in addition to all other Terms herein): <br /><br />

            a. Surfers may only purchase Visual Materials in which they are featured, captured or appear,
            or Visual Materials where a third party is featured, captured or appear, and such third party
            has provided its consent to a Surfer to purchase such Visual Materials; Surfers are not
            entitled to purchase other Visual Materials.<br />

            b. The Company may take reasonable actions to verify the identity of a Surfer before selling
            such Surfer a Visual Material.<br />

            c. Surfers agree to provide their payment information to the Company at the time they
            complete a transaction to purchase Visual Materials.<br />

            d. Surfers consent to the Company and its payments partners authorizing or reserving a charge
            on their payment card or other payment method for any amount up to the fees for the
            purchased Visual Materials (“Visual Materials Fees”) at any time between the purchase of
            the Visual Material and collection of the Visual Materials Fees.<br />

            e. Surfers agree to have sufficient funds or credit available at the applicable deadline to ensure
            that the Visual Materials Fees will be collectible.<br />

            f. You acknowledge that purchasing Visual Materials allows you to have a copy of such Visual
            Material (photographs and/or videos and/or footage and/or other media that was
            purchased), and that the Photographer is entitled to retain all intellectual property rights
            (except Moral Rights) with respect to the purchased Visual Materials.<br /><br />


            5. Fees and Payment<br /><br />
            Fees. There are no fees for creating a Photographer’s Page or registrations of a Membership.
            The pricing of the Visual Material will be featured in the applicable Photographer’s Page (“Visual
            Materials Fees”). The Company will collect the Visual Materials Fees from Surfers and will transfer
            the amount due to the Photographers (“Photographers Fees”) to the Photographers, as detailed
            below.<br /><br />

            The Company is not a payment processor and does not hold any fees. Instead, the Company uses
            Stripe, third-party payment processing partners to process fees (“Payment Processor”). You
            acknowledge and agree that the use of Payment Processors is integral to the Services and that the
            Company exchange information with Payment Processors in order to facilitate the provision of the
            Services. While using the Payment Processor’s services, you agree to be bound by the Payment
            Processor’s terms and conditions published here: https://stripe.com/legal/ssa.<br /><br />

            Within 10 Business days upon the lapse of each calendar weekly, the Company will transfer to each
            applicable Photographer all Visual Materials Fees actually collected from Surfers by the Company in
            connection with the applicable Photographer, as documented in the Company’s records, minus an
            amount equal to 20/25% of the gross amount of Visual Materials Fees that will serve as a
            commission to the Company. In addition, the Company will deduct any transaction fees and/or
            currency conversion fees incurred as part of the processing. The remaining amount shall constitute
            the Photographers Fees.<br /><br />

            You acknowledge and agree that Photographers Fees may be subject to changes and fluctuations
            due to eventualities such as currency rate calculations, which are dictated by the relevant payment
            processors services. You bear sole and exclusive responsibility for verifying the accuracy of all
            payment account details that you provide to the Company, and for all consequences of any
            erroneous or inaccurate payment account details you provide to the Company. You hereby
            irrevocably waive any claim or demand against the Company regarding Photographer Fees not being
            transferred to your account, arising from or in connection with any erroneous or inaccurate payment
            account details you provide to the Company.<br /><br />

            If you believe that you did not receive the Photographer Payments you are entitled to, you may file a
            dispute by contacting our support team at surfpik@surfpik.com within 30 days of the payment
            date. Provide details of the disputed payment in your claim. Our team will review your dispute and
            respond within 5 business days, requesting additional information if needed. We aim to resolve all
            payment disputes within 30 days of the initial filing. For complex cases, we may offer mediation
            through a neutral third-party service. Throughout this process, we will keep you informed of the
            status of your dispute. If you are unsatisfied with the outcome, you may pursue the matter through
            external dispute resolution services or legal channels, as outlined in our Terms of Service. The
            Company reserves the right to withhold future payments or suspend accounts in cases of suspected
            fraud or repeated unresolved disputes.<br /><br />

            All payments of Photographers Fees are inclusive of all taxes or charges of any kind, including
            without limitation excise, sales, use or value-added taxes, customs or other import duties, or other
            taxes, tariffs or duties or services or any component thereof. You will be responsible for paying the
            applicable taxes. If applicable laws require the withholding of such taxes, the Company will deduct
            the taxes from the applicable payment of Photographers Fees otherwise due to you, and such taxes
            shall be paid to the proper taxing authority.<br />
            The Company shall be responsible to issue a proof of payment to Surfers.<br /><br />

            6. Refunds<br /><br />

            As the Company deals exclusively with digital products (Visual Materials), we do not accept returns.
            Once a Visual Material has been downloaded, it cannot be &quot;returned&quot; in the traditional sense.
            Refunds are generally not provided for purchased Visual Materials. However, we may consider
            refunds in the following limited circumstances:<br /><br />

            · Accidental Purchase: If you placed an order by mistake and report it immediately (within 24
            hours of purchase) before downloading the Visual Material, we may process a refund at our
            discretion.<br /><br />

            · Technical Issues: If you experience significant technical problems that prevent you from
            accessing or downloading your purchased Visual Material, and our support team is unable to
            resolve the issue within a reasonable timeframe, you may be eligible for a refund.<br /><br />

            · Misrepresentation: If the Visual Material you received is substantially different from what
            was advertised on the Photographer’s Page (e.g., significantly lower resolution or quality),
            you may request a refund within 48 hours of purchase.<br />

            To request a refund, please contact our support team at surfpik@surfpik.com with your order
            number and a detailed explanation of the issue. All refund requests will be reviewed on a case-by-
            case basis, and the decision to issue a refund is at the sole discretion of The Company.<br /><br />

            7. Third-Party Websites<br /><br />

            The Service may permit you to link to other websites or resources on the internet, and other
            websites or resources may contain links to the Website. When you access third-party websites, you
            do so at your own risk. Those other websites are not under the Company’s control, and you
            acknowledge that the Company is not liable for the content, functions, accuracy, legality,
            appropriateness, or any other aspect of those other websites or resources. The inclusion on another
            website of any link to the Website does not imply endorsement by or affiliation with The Company.
            You further acknowledge and agree that The Company shall not be liable for any damage related to
            the use of any content, goods, or services available through any third-party website or resource.<br /><br />


            8. Copyright Infringements<br /><br />

            We respect the intellectual property rights of others. If you believe that any material available on or
            through the Website infringes upon any copyright you own or control, please immediately notify us
            using the contact information provided below (a “Notification”). A copy of your Notification will be
            sent to the person who posted or stored the material addressed in the Notification. Please be
            advised that pursuant to applicable law you may be held liable for damages if you make material
            misrepresentations in a Notification. Thus, if you are not sure that material located on or linked to by
            the Site infringes your copyright, you should consider first contacting an attorney.<br /><br />

            9. Intellectual Property<br /><br />

            By submitting content to the Website or otherwise through the Service, you agree to the following
            terms:<br />

            The Company will not have any ownership rights over your content you submit (“User
            Submissions”). However, the Company needs the following license to perform and market the
            Service on your behalf and on behalf of its other users and itself. You grant to the Company the
            worldwide, non-exclusive, perpetual, irrevocable, royalty-free, sublicensable, transferable right to
            (and to allow others acting on its behalf to) (i) use, edit, modify, prepare derivative works of,
            reproduce, host, display, stream, transmit, playback, transcode, copy, feature, market, sell,
            distribute, and otherwise fully exploit your User Submissions and your trademarks, service marks,
            slogans, logos, and similar proprietary rights (collectively, the &quot;Trademarks&quot;) in connection with (a)
            the Service, (b) the Company’s (and its successors&#39; and assigns’) businesses, (c) promoting,
            marketing, and redistributing part or all of the Website (and derivative works thereof) or the Service
            in any media formats and through any media channels (including, without limitation, third-party
            websites); (ii) take whatever other action is required to perform and market the Service; (iii) allow its
            users to stream, transmit, playback, download, display, feature, distribute, collect, and otherwise
            use the User Submissions and Trademarks in connection with the Service; and (iv) use and publish,
            and permit others to use and publish, the User Submissions, Trademarks, names, likenesses, and
            personal and biographical materials of you and the members of your group, in connection with the
            provision or marketing of the Service. The foregoing license grant to the Company does not affect<br /><br />


            your other ownership or license rights in your User Submissions, including the right to grant
            additional licenses to your User Submissions.<br /><br />

            10. License<br /><br />

            The Services are owned and operated by the Company. Unless otherwise indicated, all content,
            information, and other materials on the Services (excluding User Submissions), including, without
            limitation, The Company’s trademarks and logos, the visual interfaces, graphics, design, compilation,
            information, software, computer code (including source code or object code), services, text,
            pictures, information, data, sound files, other files, and the selection and arrangement thereof
            (collectively, the “Proprietary Materials”) are protected by relevant intellectual property and
            proprietary rights and laws. All Proprietary Materials are the property of the Company or its
            subsidiaries or affiliated companies and/or third-party licensors. Unless otherwise expressly stated in
            writing by the Company, by agreeing to these Terms of Service you are granted a limited, non-
            sublicensable, and non-transferable license (i.e., a personal and limited right) to access and use the
            Services for your personal use or internal business use only.<br /><br />

            The Company reserves all rights not expressly granted in these Terms of Service. This license is
            subject to these Terms of Service and does not permit you to engage in any of the following: (a)
            resale or commercial use of the Services or the Proprietary Materials; (b) distribution, public
            performance or public display of any Proprietary Materials; (c) modifying or otherwise making any
            derivative uses of the Services or the Proprietary Materials, or any portion of them; (d) use of any
            data mining, robots, or similar data gathering or extraction methods; (e) downloading (except page
            caching) of any portion of the Services, the Proprietary Materials, or any information contained in
            them, except as expressly permitted on the Services; or (f) any use of the Services or the Proprietary
            Materials except for their intended purposes. Any use of the Services or the Proprietary Materials
            except as specifically authorized in these Terms, without the prior written permission of The
            Company, is strictly prohibited and may violate intellectual property rights or other laws. Unless
            explicitly stated in these Terms, nothing in them shall be interpreted as conferring any license to
            intellectual property rights, whether by estoppel, implication, or other legal principles. The Company
            can terminate this license at any time at its absolute discretion.<br /><br />

            11. Disputes<br /><br />

            a. Indemnification<br />

            To the fullest extent permitted by applicable law, you agree to indemnify, defend, and hold
            harmless the Company, its affiliated companies, and each of our respective contractors,
            employees, officers, directors, agents, third-party suppliers, licensors, and partners (individually
            and collectively, the “The Company Parties”) from any claims, losses, damages, demands,
            expenses, costs, and liabilities, including legal fees and expenses, arising out of or related to
            your access, use, or misuse of the Services, any User Submissions you post, store, or otherwise
            transmit in or through the Services, your violation of the rights of any third party, any violation
            by you of these Terms of Service, or any breach of the representations, warranties, and
            covenants made by you herein. You agree to promptly notify the The Company Parties of any
            third-party claim, and the Company reserves the right, at your expense, to assume the exclusive
            defense and control of any matter for which you are required to indemnify the Company, and
            you agree to cooperate with Company’s defense of these claims. The Company will use
            reasonable efforts to notify you of any such claim, action, or proceeding upon becoming aware
            of it. More specifically, each Photographer and Surfer, as applicable, shall indemnify the
            Company for any damages caused to the Company as a result of a dispute over a Contract.<br /><br />


            b. Warranty Disclaimer<br /><br />

            The Company has no special relationship with or fiduciary duty to you. You acknowledge that
            the Company has no duty to take any action regarding any of the following: which users gain
            access to the Website; which Virtual Materials were purchased through the Website; what
            effects the Virtual Materials provided by Photographers may have on Surfers or other third
            parties; how third parties may interpret or use the User Content; or what actions surfers or
            other third parties may take as a result of having been exposed to the Content or to Visual
            Materials. The Company is unable to guarantee the authenticity of any data or information that
            Photographers or Surfers provide about themselves or their Photographers Page and
            Memberships. You release the Company from all liability for your having acquired or not
            acquired goods or services or Visual Materials through the Website. The Website may contain,
            or direct you to websites containing, information that some people may find offensive or
            inappropriate. The Company makes no representations concerning any content on the Website,
            and the Company is not liable for the accuracy, copyright compliance, legality, or decency of
            material contained on the Service.<br /><br />

            The Company does not guarantee that any User Content will be made available through the
            Service. The Company has no obligation to monitor the Service or content or User Submission.
            The Company reserves the right to, at any time, for any reason, and without notice: (i) cancel,
            reject, interrupt, remove, or suspend a Photographer or Photographer’s Page; (ii) remove, edit,
            or modify any content, including, but not limited to, any User Submission; and (iii) remove or
            block any Surfer or User Submission. The Company reserves the right not to comment on the
            reasons for any of these actions.<br /><br />

            The Service is provided “as is” and “as available” and is without warranty of any kind, express or
            implied, including, but not limited to, the implied warranties of title, non-infringement,
            merchantability, and fitness for a particular purpose, and any warranties implied by any course
            of performance or usage of trade, all of which are expressly disclaimed. The Company, its
            directors, employees, agents, suppliers, partners, and content providers do not warrant that: (a)
            the Service will be secure or available at any particular time or location; (b) any defects or errors
            will be corrected; (c) any content or software available at or through the Service is free of
            viruses or other harmful components; or (d) the results of using the Service will meet your
            requirements. Your use of the Service is solely at your own risk.<br />

            c. Limitation of Liability and Damages<br />

            i. Limitation of Liability<br /><br />

            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW: (A) IN NO EVENT SHALL THE
            COMPANY OR THE COMPANY PARTIES BE LIABLE FOR ANY DIRECT, SPECIAL, INDIRECT, OR
            CONSEQUENTIAL DAMAGES, OR ANY OTHER DAMAGES OF ANY KIND, INCLUDING BUT NOT
            LIMITED TO LOSS OF USE, LOSS OF PROFITS, OR LOSS OF DATA, WHETHER IN AN ACTION IN
            CONTRACT, TORT (INCLUDING BUT NOT LIMITED TO NEGLIGENCE), OR OTHERWISE, ARISING
            OUT OF OR IN ANY WAY CONNECTED WITH THE USE OF OR INABILITY TO USE THE SERVICES,
            THE CONTENT OR THE MATERIALS, INCLUDING WITHOUT LIMITATION ANY DAMAGES
            CAUSED BY OR RESULTING FROM RELIANCE ON ANY INFORMATION OBTAINED FROM THE
            COMPANY, OR THAT RESULT FROM MISTAKES, OMISSIONS, INTERRUPTIONS, DELETION OF
            FILES OR EMAIL, ERRORS, DEFECTS, VIRUSES, DELAYS IN OPERATION OR TRANSMISSION, OR
            ANY FAILURE OF PERFORMANCE, WHETHER OR NOT RESULTING FROM ACTS OF GOD,
            COMMUNICATIONS FAILURE, THEFT, DESTRUCTION, OR UNAUTHORIZED ACCESS TO THE
            COMPANY’S RECORDS, PROGRAMS, OR SERVICES; AND (B) IN NO EVENT SHALL THE

            AGGREGATE LIABILITY OF THE COMPANY, WHETHER IN CONTRACT, WARRANTY, TORT
            (INCLUDING NEGLIGENCE, WHETHER ACTIVE, PASSIVE, OR IMPUTED), PRODUCT LIABILITY,
            STRICT LIABILITY, OR OTHER THEORY, ARISING OUT OF OR RELATING TO THE USE OF OR
            INABILITY TO USE THE SERVICES EXCEED THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING
            THE SERVICES DURING THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE DATE OF
            THE CLAIM OR TWO HUNDRED DOLLARS, WHICHEVER IS GREATER. TO THE EXTENT THAT
            APPLICABLE LAW PROHIBITS LIMITATION OF SUCH LIABILITY, THE COMPANY SHALL LIMIT ITS
            LIABILITY TO THE FULL EXTENT ALLOWED BY APPLICABLE LAW.<br /><br />

            To the extent required by applicable law, nothing in these Terms shall restrict our liability for
            death or personal injuries caused by The Company; for damages caused by The Company’s
            fraud, willful misconduct, or gross negligence; and for other losses that may not be excluded
            or limited by applicable law.<br /><br />

            ii. Basis of the Bargain<br /><br />

            YOU ACKNOWLEDGE AND AGREE THAT THE COMPANY HAS OFFERED THE SERVICES AND
            OTHER CONTENT AND INFORMATION, SET ITS PRICES, AND ENTERED INTO THESE TERMS OF
            SERVICE IN RELIANCE UPON THE WARRANTY DISCLAIMERS AND LIMITATIONS OF LIABILITY
            SET FORTH HEREIN, THAT THE WARRANTY DISCLAIMERS AND LIMITATIONS OF LIABILITY SET
            FORTH HEREIN REFLECT A REASONABLE AND FAIR ALLOCATION OF RISK BETWEEN YOU AND
            THE COMPANY, AND THAT THE WARRANTY DISCLAIMERS AND LIMITATIONS OF LIABILITY SET
            FORTH HEREIN FORM AN ESSENTIAL BASIS OF THE BARGAIN BETWEEN YOU AND THE
            COMPANY. THE COMPANY WOULD NOT BE ABLE TO PROVIDE THE SERVICES TO YOU ON AN
            ECONOMICALLY REASONABLE BASIS WITHOUT THESE LIMITATIONS.<br /><br />

            12. Termination<br /><br />

            The Company may terminate your access to the Service, with cause (for example, If we detect
            suspicious or unauthorized fraudulent activity carried out by you) that can which may result in
            the forfeiture and deletion of all information associated with your use of the Website. If you
            wish to terminate your Photographer’s Page or Membership, please contact us at:
            surfpik@surfpik.com. The Commission amounts due to Company are non-refundable. All
            provisions of the Terms of Use that by their nature should survive termination shall survive
            termination, including, without limitation, ownership provisions, warranty disclaimers,
            indemnity, and limitations of liability.<br /><br />

            13. Applicable Law and Venue<br /><br />

            These Terms of Service (and any further rules, policies, or guidelines incorporated by reference)
            shall be governed by and construed in accordance with the laws of the State of New York and
            the United States, without giving effect to any principles of conflicts of law. You agree that the
            Company and its Services are deemed a passive website that does not give rise to personal
            jurisdiction over The Company or its parents, subsidiaries, affiliates, successors, assigns,
            employees, agents, directors, officers or shareholders, either specific or general, in any
            jurisdiction other than the State of New York. You agree that any action at law or in equity
            arising out of or relating to these terms, or your use or non-use of the Services, shall be filed
            only in the state or federal courts located in New York City in the State of New York and you
            hereby consent and submit to the personal jurisdiction of such courts for the purposes of

            litigating any such action. You hereby irrevocably waive any right you may have to trial by jury in
            any dispute, action, or proceeding.
            To the extent permitted by applicable law, you and the Company agree that any cause of action
            arising out of or related to the Services must commence within one (1) year after the cause of
            action accrues. Otherwise, such cause of action is permanently barred.<br /><br />

            14. Additional Terms<br /><br />

            a. Integration and Severability<br />

            These Terms of Use and other referenced material are the entire agreement between you and
            the Company with respect to the Service and supersede all prior or contemporaneous
            communications and proposals (whether oral, written or electronic) between you and the
            Company with respect to the Service and govern the future relationship. If any provision of the
            Terms of Use is found to be unenforceable or invalid, that provision will be limited or eliminated
            to the minimum extent necessary so that the Terms of Use will otherwise remain in full force
            and effect and enforceable. The failure of either party to exercise in any respect any right
            provided for herein shall not be deemed a waiver of any further rights hereunder.<br /><br />

            b. Miscellaneous<br />

            The Company shall not be liable for any failure to perform its obligations hereunder where the
            failure results from any cause beyond the Company’s reasonable control, including, without
            limitation, mechanical, electronic, or communications failure or degradation. The Terms of Use
            are personal to you, and are not assignable, transferable, or sublicensable by you except with
            the Company&#39;s prior written consent. The Company may assign, transfer, or delegate any of its
            rights and obligations hereunder without consent. No agency, partnership, joint venture, or
            employment relationship is created as a result of the Terms of Use and neither party has any
            authority of any kind to bind the other in any respect. In any action or proceeding to enforce
            rights under the Terms of Use, the prevailing party will be entitled to recover costs and
            attorneys&#39; fees. All notices under the Terms of Use will be in writing and will be deemed to have
            been duly given when received, if personally delivered or sent by certified or registered mail,
            return receipt requested; when receipt is electronically confirmed, if transmitted by facsimile or
            e-mail; or the day after it is sent, if sent for next day delivery by recognized overnight delivery
            service.<br /><br />


            Contact Information<br />

            The Services are offered by:<br />
            Picawave, LLC<br />
            Attention: Legalinc Corporate Services Inc.<br />
            131 Continental Dr, Suite 305<br />
            Newark, Delaware 19713<br />
          </Typography>


        </AboutSection>
      )}













      {type == "Privacy Policy" && (
        <AboutSection sx={{ width: isMobile ? '95%' : '75%', margin: '0 auto' }}>
          <Typography variant="h4" gutterBottom align="center">
            Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph align="left">

            At Surfpik, developed and owned by Picawave, LLC (the “Company”) we are committed to protecting
            the privacy and personal information of our users. This Privacy Policy outlines how we collect, use,
            disclose, and safeguard your information when you use our exclusive digital marketplace connecting
            Photographers with Surfers.<br /><br />

            Surfpik is a dedicated platform designed specifically for two user groups:<br />
            1. Photographers who capture and upload surfing action Visual Materials taken at surf
            location, such as public beaches (“Photographers”).<br />
            2. Surfers who search for, view, and purchase digital copies of Visual Materials featuring
            themselves (“Surfers”).<br /><br />

            This Privacy Policy applies to all users of Surfpik, whether you are a Photographer or a Surfer. By
            accessing or using our Services, you agree to the collection and use of information in accordance
            with this Privacy Policy.<br /><br />

            We understand the importance of your personal information and are dedicated to maintaining its
            confidentiality. This Privacy Policy explains:<br /><br />

            · What information we collect and why<br />
            · How we use and protect your information<br />
            · Your rights regarding your personal data<br />
            · Our data retention practices<br />
            · How to contact us about privacy concerns<br /><br />

            Please read this Privacy Policy carefully to understand our practices regarding your personal
            information and how we will treat it. If you do not agree with our policies and practices, please do
            not use Surfic. By continuing to use our Services, you acknowledge that you have read and
            understood this Privacy Policy.<br /><br />

            1. Personal Information We Collect <br />

            Surfpik collects personal information in several ways, primarily: <br />

            · When Photographers or Surfers provide personal information directly to us (such as when
            setting up a Photographer Page or Membership);<br />

            · When we passively collect personal information from you (such as from your interaction
            with our Website);<br />

            · From other parties (such as Surfpik&#39;s payment provider).
            Information You Provide Surfpik<br /><br />

            This is information that you provide us through text fields, such as your name, payment information,
            and contact details. The information we require you to provide differs depending on whether you
            create an account as a Photographer or Surfer, upload Visual Materials, purchase Visual Materials, or
            otherwise use our Services. Typically, this includes:<br /><br />

            · First and last name<br />
            · Email address<br />
            · Phone number (optional)<br />
            · Username<br />
            · Password<br />

            You may also have the option to sign up for Surfpik using a Facebook, Google, or Apple account. We
            will ask for permission to access basic information from these accounts, such as your userID, full
            name, email address, and profile picture. You can choose to stop sharing that information with us at
            any time by removing Surfpiks access to that account through Facebook, Google, or Apple settings.<br />
            You may also have the option to add more information to your Photographer Page or Membership,
            such as a location, social media links, and an &quot;about me&quot; section, which we store along with the
            other information we collect.<br /><br />

            Surfers<br /><br />
            In addition to the information you provided when creating a Membership, we collect and process
            the following information specific to Surfers:<br />
            · Your browsing and search history within the Website;<br />
            · Visual Materials you have viewed or marked as favourites;<br />
            · Purchase history, including the Visual Materials you have purchased.<br /><br />

            When you purchase a Visual Material, you will be asked to provide your payment information to our
            payment partner, Stripe, Inc (&quot;Stripe&quot;). The Company partners with Stripe for payment processing,
            and the payment information you submit is collected and used by Stripe in accordance with their
            privacy practices (read Stripe&#39;s Privacy Policy). The Company only stores the last four digits of your
            credit card or bank account (as applicable), expiration date, and country, which we require for tax,
            regulatory, and security purposes.<br /><br />

            As a Surfer, you may choose to provide additional information to enhance your experience and
            improve photo discovery:<br />
            · Physical characteristics (e.g., hair color, board type) to help identify you in Visual Materials<br />
            · Preferred surfing locations<br />
            · Social media handles for easier photo sharing (optional)<br /><br />

            We may also derive your location from your self-disclosed country, your IP address, and/or your
            payment card information to provide location-based services and comply with applicable laws and
            regulations.<br />
            Please note that any information you choose to make public on your Membership page will be
            visible to other users of Surfpik. Exercise caution when deciding what information to share publicly.
            Photographers<br /><br />
            In addition to the information you provided when creating a Photographer Page, we collect and
            process the following information specific to Photographers:<br />
            · Details about the Visual Materials you upload, including metadata, location, and date taken<br />
            · Your photography equipment information (optional)<br />
            · Preferred surfing locations for photography<br />
            · Portfolio samples<br />
            · Bank account information for payment processing<br /><br />
            When you upload a Visual Material, you will be asked to provide information about the image,
            footage, video etc., such as:<br />
            · Photography style or specialties<br />

            · Years of experience<br />
            · Social media handles and website links (optional)<br />
            · Brief bio or &quot;about me&quot; section<br />
            We use this information to:<br />
            · Display your Visual Materials in relevant search results<br />
            · Process payments for purchases of Visual Materials<br />
            · Provide analytics on your Visual Materials views and sales<br />
            · Facilitate communication between you and potential buyers<br /><br />

            We may also derive your location from your self-disclosed country, your IP address, and/or your
            payment information to provide location-based services and comply with applicable laws and
            regulations.<br /><br />

            Please note that any information you choose to make public on your Photographer’s Page will be
            visible to other users of Surfpik. Exercise caution when deciding what information to share publicly.<br /><br />

            2. Photographers&#39; Privacy Obligations<br /><br />
            As an independent Photographer using Surfpik, you are responsible for complying with all applicable
            privacy laws and regulations. This includes:<br />
            · Respecting the applicable privacy rights of Surfers when capturing, uploading, or selling
            Visual Materials<br />
            · Using Surfers&#39; personal information only as necessary to deliver your services or
            communicate directly with them<br />
            · Not selling or using Surfers&#39; personal information for targeted advertising purposes<br />
            · Securely storing and managing any personal data you collect<br />
            · Promptly responding to valid data subject requests (e.g., access, correction, deletion)<br />
            · Assisting Surfpik in responding to privacy-related queries or concerns<br />
            · Remaining fully liable towards Surfers and Surfpik for any breach of these privacy obligations
            The Company reserves the right to suspend or terminate Photographer’s registration, in case such
            Photographer found to be in violation of these privacy obligations.<br /><br />

            3. Additional Information We Collect<br /><br />
            Automatically Collected Information<br />
            When you access or use the Website or interact with our Services, we automatically receive certain
            information, even if you haven&#39;t created a Photographer’s Page or Membership. This information
            may include:<br />
            · Your IP address and approximate location (typically derived from your IP address)<br />
            · Your browser and device type<br />
            · Your operating system<br />
            · Language settings<br />
            · Referring web page (including parameters contained therein)<br />
            · Search terms used to find THE Website<br />
            · Links you click and pages you visit the Website<br />
            · Session length, dwell time, and duration of media experiences (including view time of
            photos)<br />

            · Device information (including device and application IDs)<br />
            · Mobile carrier (if accessing via mobile device)<br />
            · Cookie information (as detailed in our separate Cookie Policy)<br /><br />
            We use this information to:<br />
            · Improve our Service and enhance user experience<br />
            · Ensure proper functioning of the Website and the Services for both Photographers and
            Surfers<br />
            · Analyze usage patterns and optimize the Website’s performance<br />
            · Personalize content and features based on user preferences<br />
            · Prevent fraud and abuse on our Website and/or Services<br />
            · Comply with legal obligations and industry standards<br /><br />

            This data collection helps us provide a seamless and secure experience for our users while
            continuously improving our Services&#39; functionality and performance.<br /><br />

            Information from Third-Party Accounts<br /><br />

            After creating a Photographer’s Page or Membership, you may have the option to connect your
            social media account(s) (e.g., Instagram, Facebook, Twitter) with Surfpik. If you choose to do so, we
            may collect and store some information related to those accounts, including:<br /><br />

            · Profile information (userID, username, profile picture)<br />
            · Engagement metrics (follower counts, view/like/comment counts)<br />
            · Public posts related to surfing or photography<br /><br />

            When you connect a third-party account to your Photographer’s Page or Membership, that third-
            party service will typically present a page that describes the information that Surfpik can access
            and/or permissions you are granting to Surfpik. We only request access to information that is
            relevant to enhancing your experience on the Website, such as helping you discover photos you
            might be featured in or connecting with photographers you have interacted with on other platforms.
            You can revoke Surfpik&#39;s access to these accounts at any time using the respective third party&#39;s
            settings page. Disconnecting your social media accounts from Surfpik will not delete information
            we&#39;ve already collected, but it will prevent us from collecting additional information from those
            accounts in the future.<br /><br />

            The Company respects your privacy settings on third-party platforms and will only access publicly
            available information or information you&#39;ve explicitly granted us permission to access.<br /><br />

            4. How We Use Information<br /><br />
            At Surfpik, we use the information we collect for the following purposes:<br />
            · To comply with industry requirements, self-regulatory guidelines, and applicable laws,
            including tax reporting requirements<br />
            · To verify your identity and enable you to sign in to your Photographer’s Page or Membership<br />
            · To facilitate the upload, discovery, and purchase of Visual Materials on our Website<br />
            · To process payments to Photographers and handle transactions for Surfers<br />
            · To deliver digital Visual Materials to Surfers<br />
            · To send you important messages, notifications, and updates about your Photographer’s
            Page or Membership or purchases<br />

            · To provide customer support and respond to your inquiries<br />
            · To promote Photographers&#39; work and increase discoverability of their Visual Materials<br />
            · To personalize your experience on the Website<br />
            · To market our Services to you or to audiences similar to you, in accordance with your
            marketing preferences<br />
            · To analyze and improve our Website&#39;s performance and user experience<br />
            · To conduct research and development to enhance the Company&#39;s features and Services<br />
            · To prevent fraud, abuse, and illegal activities on our Website, using both automated
            processing and manual review<br />
            · To apply appropriate taxes, such as sales tax or VAT, based on your location
            We process this information based on our legitimate interests in providing and improving the Surfpik
            Services, fulfilling our contractual obligations to you, complying with legal requirements, and, where
            applicable, with your consent.<br /><br />

            Please note that we never sell your personal information to third parties. Any sharing of information
            is done in accordance with this Privacy Policy and is limited to what is necessary to provide our
            Services or comply with legal obligations.<br /><br />

            Information Shared with Photographers<br />
            By using Surfpik as a Surfer, you agree to share certain personal data with Photographers when you
            view, favourite, or purchase their Visual Materials. This information may include:<br />
            · Your full name as it appears in your Surfpik Membership page<br />
            · Your Surfpik username<br />
            · Your profile picture or avatar<br />
            · The date and time you viewed or purchased a Visual Material<br />
            · Your general location (city and country, if provided)<br />
            · Any public information you&#39;ve added to your Surfpik profile<br /><br />
            When you purchase a Visual Material, the Photographer will also receive:<br />
            · Information about the transaction, including the purchase date and Visual Material details<br />
            · Your email address (for delivery of the digital Visual Material)<br />
            When you use Surfpik to send a message to a Photographer, the contents of that message will be
            shared with the recipient.<br />
            Please note that any information you choose to make public on your Membership page will be
            visible to other users of Surfpik, including Photographers. Exercise caution when deciding what
            information to share publicly.<br />
            Surfpik operates as an intermediary platform connecting surf Photographers with Surfers. While we
            strive to maintain a safe and compliant environment, including controlling the content displayed on
            the Website, it&#39;s important to understand that Photographers using Surfpik are independent
            contractors, not employees or agents of the Company. We do not have direct control over
            Photographers&#39; actions or their compliance with privacy laws outside of the Website. We encourage
            all users to report any privacy concerns to surfpik@surfpik.com, and we will investigate and respond
            to the best of our ability.<br /><br />

            Information Shared with Third Parties<br /><br />

            At Surfpik, we prioritize your privacy and never sell your personal information to third parties. We
            only share data with third parties under the following circumstances:<br />
            Service Providers: We may share your personal data with companies that are contractually engaged
            to provide us with services, including:<br />
            · Cloud hosting and content distribution<br />
            · Order fulfilment for digital Visual Material delivery<br />
            · Email and document management<br />
            · Internal communication systems<br />
            · Analytics<br />
            · Payment processing and multi-currency settlement solutions <br />
            · Fraud detection and prevention<br />
            These service providers are subject to strict confidentiality and security measures, and may only use
            your personal data on the Company’s behalf and according to our instructions.<br /><br />

            Government and Law Enforcement Agencies:<br /><br />

            · Tax Reporting: We may share information to satisfy our obligations to report to tax
            authorities, including information about Photographers&#39; earnings on Surfpik, tax
            identification information, and information related to transactional taxes such as Value
            Added Tax, Goods and Services Tax, and sales tax where applicable.<br /><br />
            · Legal Process: We may disclose information if we believe it is reasonably necessary to
            comply with a law, regulation, or valid legal process (e.g., subpoenas or warrants served on
            Surfpik). When legally permitted and under appropriate circumstances, we will endeavor to
            notify you (typically by email) of any such disclosure.<br /><br />
            Business Transfers: In the event of a sale, merger, bankruptcy, sale of assets, or reorganization of our
            company, your information may be transferred to the new entity. In such a case, the promises in this
            Privacy Policy will apply to any data transferred to the new entity.<br /><br />
            Aggregated or Anonymized Information: We may share aggregated or anonymized information that
            cannot reasonably be used to identify you with third parties for research, marketing, analytics, or
            other purposes.<br /><br />
            We ensure that any third parties with whom we share information are contractually obligated to
            maintain the confidentiality and security of your personal data, and to use it only for the purposes
            for which it is shared.<br /><br />

            5. Your Privacy Rights and Choices<br /><br />
            At Surfpik, we respect your privacy rights and are committed to providing you with control over your
            personal information. You have the following rights regarding your personal data:<br />
            · Access and Update: You can access and update most of your account information directly
            through your Surfpik account settings.<br />
            · Data Deletion: You can request deletion of your Surfpik account or specific personal
            information by emailing surfpik@surfpik.com. We will make efforts to delete such
            information within 30 days, subject to legal and operational requirements.<br />
            · Data Portability: You can request a copy of your personal data in a structured, commonly
            used, and machine-readable format.<br /><br />

            · Withdraw Consent: Where we rely on your consent to process your personal data, you can
            withdraw that consent at any time.<br />
            · Object to Processing: In certain circumstances, you can object to the processing of your
            personal data.<br />
            · Restrict Processing: You can request that we restrict the processing of your personal data
            under certain conditions.<br />
            · Visual Material Removal: If a Visual Material in which you are captured is displayed on the
            Website without your consent, we will remove it promptly upon verification of your request.<br />
            · Marketing Communications: You can opt out of receiving marketing communications at any
            time by clicking the &quot;unsubscribe&quot; link in any marketing email or contacting us at
            surfpik@surfpik.com.<br />
            · Cookie Preferences: You can manage your cookie preferences through your browser
            settings. For more information, refer to our Cookie Policy.<br />
            To exercise these rights, please contact us at surfpik@surfpik.com. Include your full name,
            username, country of residence, and the specific right you wish to exercise. We may need to verify
            your identity before processing your request.<br />
            For EEA Residents: If you are a resident of the European Economic Area, you have additional rights
            under the General Data Protection Regulation (GDPR), including the right to lodge a complaint with
            your local data protection authority. <br />
            For California Residents: California residents have specific rights under the California Consumer
            Privacy Act (CCPA) and the California Privacy Rights Act (CPRA), including the right to know what
            personal information we collect, request deletion, and opt-out of the sale of personal information.
            We will respond to valid requests within 30 days, although in some cases it may take longer. We will
            keep you informed if this is the case. While we aim to honor all valid requests, there may be
            instances where we are unable to do so due to legal requirements, technical limitations, or
            legitimate business interests. In such cases, we will explain our reasoning to you.<br /><br />

            6. Contact Us<br />
            If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy
            practices, please contact our Data Protection Team at:<br />
            Email: surfpik@surfpik.com<br />
            Picawave, LLC<br />
            Attention: Legalinc Corporate Services Inc.<br />
            131 Continental Dr, Suite 305<br />
            Newark, Delaware 19713<br />
            We take all privacy concerns seriously and will investigate and respond to your inquiry promptly.<br />

          </Typography>
        </AboutSection>
      )}










      {type == "Take Down Policy" && (
        <AboutSection sx={{ width: isMobile ? '95%' : '75%', margin: '0 auto' }}>

          <Typography variant="h4" gutterBottom align="center">
            Take Down Policy
          </Typography>

          <Typography variant="body1" paragraph align="left">


            At Surfpik, we respect individual privacy rights and intellectual property. If you find a Visual Matrial
            (photograph, video, footage or other media) on our Website that you want removed, please follow
            these steps:<br /><br />

            For Privacy Concerns:<br />
            If you appear in a Visual Material and want it removed for privacy reasons, email
            surfpik@surfpik.com with:<br />
            · The URL of the Visual Material<br />
            · A brief explanation of why you want it removed<br />
            · Proof of your identity (e.g., a photo of yourself)<br /><br />

            For Copyright Issues:<br />
            If you believe a Visual Material infringes on your copyright, email surfpik@surfpik.com with:<br />
            · The URL of the infringing Visual Material<br />
            · Proof of your copyright ownership<br />
            · A statement that you have not authorized the use of the Visual Material on Surfpik<br /><br />

            We will review all requests within 10 business days. If the request is valid, we will remove the Visual
            Material promptly. We reserve the right to reinstate Visual Material if we receive evidence that a
            take-down request was invalid or made in error.<br /><br />

            Note: Abuse of this policy may result in account suspension or termination.<br /><br />

            For more information, please refer to our full Terms of Service and Privacy Policy.<br />
          </Typography>

        </AboutSection>
      )}











    </>
  );
};

export default Terms;
