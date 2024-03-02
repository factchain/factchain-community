const getColorScheme = () => {
  const backgroundColor =
    document.getElementsByTagName('body')[0].style['background-color'];
  if (backgroundColor === 'rgb(0, 0, 0)') {
    return 'dark';
  } else if (backgroundColor === 'rgb(255, 255, 255)') {
    return 'light';
  } else {
    return 'dim';
  }
};

const removeWhitespaces = (htmlContent) => htmlContent.replaceAll(/>\s+/g, '>');

export const mainArticleSelector = () => "article[tabindex='-1']";
export const dropdownSelector = () => "div[data-testid='Dropdown']";
export const dropdownUrlSelector = () => "a[data-testid='tweetEngagements']";
export const ratingStatusSelector = () => "div[data-testid='ratingStatus']";
export const noteContentSelector = () =>
  'div.css-175oi2r.r-1471scf.r-18u37iz.r-iphfwy.r-1h8ys4a';

export const approvedXNotesSelector = () => {
  const colorScheme = getColorScheme();
  const htmlBuilder = htmlBuilders[colorScheme];
  return removeWhitespaces(htmlBuilder.approvedXNotes);
};

export const makeFactchainNoteHtml = (
  isAuthor,
  content,
  rateNoteButtonID,
  mintSFTButtonID
) => {
  const colorScheme = getColorScheme();
  const htmlBuilder = htmlBuilders[colorScheme];
  let actionHtml = '';
  if (rateNoteButtonID) {
    actionHtml += htmlBuilder.action(
      'Do you find this helpful?',
      rateNoteButtonID,
      'Rate it'
    );
  }
  if (mintSFTButtonID) {
    actionHtml += htmlBuilder.action(
      'Do you like this Factchain note?',
      mintSFTButtonID,
      'Collect it'
    );
  }

  const title = `${isAuthor ? 'You' : 'Factchain users'} added context`;
  return removeWhitespaces(
    htmlBuilder.note(title, content, htmlBuilder.logo, actionHtml)
  );
};

export const makeDropdownNoteCreationButton = () => {
  const colorScheme = getColorScheme();
  const htmlBuilder = htmlBuilders[colorScheme];
  return removeWhitespaces(
    htmlBuilder.dropdownNoteCreationButton(htmlBuilder.logo)
  );
};

export const makeMintXNoteOnDetailsPageHtml = () => {
  const colorScheme = getColorScheme();
  const htmlBuilder = htmlBuilders[colorScheme];
  return removeWhitespaces(htmlBuilder.mintXNoteOnDetailsPage);
};

export const makeMintXNoteOnMainPageHtml = () => {
  const colorScheme = getColorScheme();
  const htmlBuilder = htmlBuilders[colorScheme];
  return removeWhitespaces(htmlBuilder.mintXNoteOnMainPage);
};

const htmlBuilders = {
  dim: {
    logo: '<svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; margin-right: 5px; overflow: visible; fill: #00adb5; stroke: #00adb5;" viewBox="0 0 512 512" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1cvl2hr r-1q142lx r-1kb76zh"><path d="M483.4 244.2L351.9 287.1h97.74c-9.874 10.62 3.75-3.125-46.24 46.87l-147.6 49.12h98.24c-74.99 73.12-194.6 70.62-246.8 54.1l-66.14 65.99c-9.374 9.374-24.6 9.374-33.98 0s-9.374-24.6 0-33.98l259.5-259.2c6.249-6.25 6.249-16.37 0-22.62c-6.249-6.249-16.37-6.249-22.62 0l-178.4 178.2C58.78 306.1 68.61 216.7 129.1 156.3l85.74-85.68c90.62-90.62 189.8-88.27 252.3-25.78C517.8 95.34 528.9 169.7 483.4 244.2z"></path></svg>',
    action: (title, buttonId, content) =>
      `<span class="r-4qtqp9" style="min-width: 12px; min-height: 12px;"></span>
      <div class="css-175oi2r r-1awozwy r-126aqm3 r-5kkj8d r-18u37iz r-16y2uox r-1wtj0ep r-1e081e0 r-1f1sjgu">
        <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-1b43r93 r-1cwl3u0 r-16dba41" style="text-overflow: unset; color: rgb(247, 249, 249);">
          <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${title}</span>
        </div>
        <div id="${buttonId}" role="link" tabindex="0" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-15ysp7h r-4wgw6l r-ymttw5 r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" style="border-color: rgb(83, 100, 113); background-color: rgba(0, 0, 0, 0);">
          <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="text-overflow: unset; color: rgb(239, 243, 244);">
            <span class="css-1qaijid r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0" style="text-overflow: unset;">
              <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${content}</span>
            </span>
          </div>
        </div>
      </div>`,
    note: (title, content, logoHtml, actionHtml) =>
      `<div tabindex="0" class="css-175oi2r r-18bvks7 r-1867qdf r-rs99b7 r-1s2bzr4 r-1udh08x r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" data-testid="birdwatch-pivot" role="link">
      <div class="css-175oi2r r-k4xj1c r-1cuuowz r-6koalj r-18u37iz r-1e081e0 r-1f1sjgu">
        <div class="css-175oi2r r-18u37iz r-13qz1uu">
          ${logoHtml}
          <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-1b43r93 r-1cwl3u0 r-b88u0q r-1awozwy r-6koalj r-1vvnge1 r-13qz1uu" style="text-overflow: unset; color: rgb(247, 249, 249);">
            <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${title}</span>
          </div>
        </div>
      </div>
      <span class="r-4qtqp9" style="min-width: 12px; min-height: 12px;"></span>
      <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1e081e0" style="text-overflow: unset; color: rgb(247, 249, 249);">
        <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;"><span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${content}</span></span>
      </div>
      ${actionHtml || '<br/>'}
    </div>`,
    dropdownNoteCreationButton: (logoHtml) =>
      `<a role="menuitem" class="css-175oi2r r-18u37iz r-ymttw5 r-1f1sjgu r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" data-testid="fc-note">
      <div class="css-1dbjc4n r-1777fci r-j2kj52">
        ${logoHtml}
      </div>
      <div class="css-1dbjc4n r-16y2uox r-1wbh5a2" id="createNoteButton">
        <div dir="ltr" class="css-901oao r-1nao33i r-1qd0xha r-a023e6 r-b88u0q r-rjixqe r-bcqeeo r-qvutc0">
          <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">Create Factchain Note</span>
        </div>
      </div>
    </div>`,
    mintXNoteOnDetailsPage: `<div class="css-175oi2r r-g6ijar r-nsbfu8 r-1xfd6ze">
      <div class="css-175oi2r r-1awozwy r-18u37iz r-1wtj0ep">
        <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-b88u0q" style="color: rgb(247, 249, 249); text-overflow: unset;">
          <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Do you like this note?</span>
        </div>
        <div class="css-175oi2r r-18u37iz">
          <div id="mintNoteButton" role="button" tabindex="0" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-791edh r-id7aif r-15ysp7h r-4wgw6l r-ymttw5 r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l" style="border-color: rgb(83, 100, 113); background-color: rgba(0, 0, 0, 0);">
            <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="color: rgb(29, 155, 240); text-overflow: unset;">
              <span class="css-1qaijid r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0" style="text-overflow: unset;">
                <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Collect it on Factchain</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>`,
    mintXNoteOnMainPage: `<div class="css-175oi2r r-1awozwy r-126aqm3 r-5kkj8d r-18u37iz r-16y2uox r-1wtj0ep r-1e081e0 r-1f1sjgu r-ea455c">
      <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-1qd0xha r-1b43r93 r-1cwl3u0 r-16dba41" style="color: rgb(231, 233, 234); text-overflow: unset;">
        <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Do you like this note?</span>
      </div>
      <div role="link" tabindex="0" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-15ysp7h r-4wgw6l r-ymttw5 r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" style="border-color: rgb(83, 100, 113); background-color: rgba(0, 0, 0, 0);">
        <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-1qd0xha r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="color: rgb(239, 243, 244); text-overflow: unset;">
          <span class="css-1qaijid r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0" style="text-overflow: unset;">
            <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Collect it on Factchain</span>
          </span>
        </div>
      </div>
    </div>`,
    approvedXNotes:
      "div[data-testid='birdwatch-pivot'].css-175oi2r.r-18bvks7.r-1udh08x.r-g6ijar.r-1mhqjh3.r-5kkj8d.r-1va55bh.r-1mnahxq.r-o7ynqc.r-6416eg.r-1ny4l3l.r-1loqt21",
  },
  dark: {
    logo: '<svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; margin-right: 5px; overflow: visible; fill: #00adb5; stroke: #00adb5;" viewBox="0 0 512 512" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-1q142lx"><path d="M483.4 244.2L351.9 287.1h97.74c-9.874 10.62 3.75-3.125-46.24 46.87l-147.6 49.12h98.24c-74.99 73.12-194.6 70.62-246.8 54.1l-66.14 65.99c-9.374 9.374-24.6 9.374-33.98 0s-9.374-24.6 0-33.98l259.5-259.2c6.249-6.25 6.249-16.37 0-22.62c-6.249-6.249-16.37-6.249-22.62 0l-178.4 178.2C58.78 306.1 68.61 216.7 129.1 156.3l85.74-85.68c90.62-90.62 189.8-88.27 252.3-25.78C517.8 95.34 528.9 169.7 483.4 244.2z"></path></svg>',
    action: (title, buttonId, content) =>
      `<span class="r-4qtqp9" style="min-width: 12px; min-height: 12px;"></span>
      <div class="css-175oi2r r-1awozwy r-1roi411 r-5kkj8d r-18u37iz r-16y2uox r-1wtj0ep r-1e081e0 r-1f1sjgu">
        <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-1b43r93 r-1cwl3u0 r-16dba41" style="text-overflow: unset; color: rgb(247, 249, 249);">
          <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${title}</span>
        </div>
        <div id="${buttonId}" role="link" tabindex="0" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-15ysp7h r-4wgw6l r-ymttw5 r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" style="border-color: rgb(83, 100, 113); background-color: rgba(0, 0, 0, 0);">
          <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="text-overflow: unset; color: rgb(239, 243, 244);">
            <span class="css-1qaijid r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0" style="text-overflow: unset;">
              <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${content}</span>
            </span>
          </div>
        </div>
      </div>`,
    note: (title, content, logoHtml, actionHtml) =>
      `<div tabindex="0" class="css-175oi2r r-1kqtdi0 r-1867qdf r-rs99b7 r-1s2bzr4 r-1udh08x r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" data-testid="birdwatch-pivot" role="link">
      <div class="css-175oi2r r-k4xj1c r-g2wdr4 r-6koalj r-18u37iz r-1e081e0 r-1f1sjgu">
        <div class="css-175oi2r r-18u37iz r-13qz1uu">
          ${logoHtml}
          <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-1b43r93 r-1cwl3u0 r-b88u0q r-1awozwy r-6koalj r-1vvnge1 r-13qz1uu" style="text-overflow: unset; color: rgb(247, 249, 249);">
            <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${title}</span>
          </div>
        </div>
      </div>
      <span class="r-4qtqp9" style="min-width: 12px; min-height: 12px;"></span>
      <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1e081e0" style="text-overflow: unset; color: rgb(247, 249, 249);">
        <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;"><span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${content}</span></span>
      </div>
      ${actionHtml || '<br/>'}
    </div>`,
    dropdownNoteCreationButton: (logoHtml) =>
      `<a role="menuitem" class="css-175oi2r r-18u37iz r-ymttw5 r-1f1sjgu r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" data-testid="fc-note">
      <div class="css-1dbjc4n r-1777fci r-j2kj52">
        ${logoHtml}
      </div>
      <div class="css-1dbjc4n r-16y2uox r-1wbh5a2" id="createNoteButton">
        <div dir="ltr" class="css-901oao r-1nao33i r-1qd0xha r-a023e6 r-b88u0q r-rjixqe r-bcqeeo r-qvutc0">
          <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">Create Factchain Note</span>
        </div>
      </div>
    </div>`,
    mintXNoteOnDetailsPage: `<div class="css-175oi2r r-g2wdr4 r-nsbfu8 r-1xfd6ze">
      <div class="css-175oi2r r-1awozwy r-18u37iz r-1wtj0ep">
        <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-1qd0xha r-a023e6 r-rjixqe r-b88u0q" style="color: rgb(231, 233, 234); text-overflow: unset;">
          <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Do you like this note?</span>
        </div>
        <div class="css-175oi2r r-18u37iz">
          <div id="mintNoteButton" role="button" tabindex="0" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-791edh r-id7aif r-15ysp7h r-4wgw6l r-ymttw5 r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l" style="border-color: rgb(83, 100, 113); background-color: rgba(0, 0, 0, 0);">
            <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-1qd0xha r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="color: rgb(29, 155, 240); text-overflow: unset;">
              <span class="css-1qaijid r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0" style="text-overflow: unset;">
                <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Collect it on Factchain</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>`,
    mintXNoteOnMainPage: `<div class="css-175oi2r r-1awozwy r-1roi411 r-5kkj8d r-18u37iz r-16y2uox r-1wtj0ep r-1e081e0 r-1f1sjgu">
      <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-1qd0xha r-1b43r93 r-1cwl3u0 r-16dba41" style="color: rgb(231, 233, 234); text-overflow: unset;">
        <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Do you like this note?</span>
      </div>
      <div role="link" tabindex="0" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-15ysp7h r-4wgw6l r-ymttw5 r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" style="border-color: rgb(83, 100, 113); background-color: rgba(0, 0, 0, 0);">
        <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-1qd0xha r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="color: rgb(239, 243, 244); text-overflow: unset;">
          <span class="css-1qaijid r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0" style="text-overflow: unset;">
            <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Collect it on Factchain</span>
          </span>
        </div>
      </div>
    </div>`,
    approvedXNotes:
      "div[data-testid='birdwatch-pivot'].css-175oi2r.r-1kqtdi0.r-1udh08x.r-g2wdr4.r-1mhqjh3.r-5kkj8d.r-1va55bh.r-1mnahxq.r-o7ynqc.r-6416eg.r-1ny4l3l.r-1loqt21",
  },
  light: {
    logo: '<svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; margin-right: 5px; overflow: visible; fill: #00adb5; stroke: #00adb5;" viewBox="0 0 512 512" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1cvl2hr r-1q142lx r-1kb76zh"><path d="M483.4 244.2L351.9 287.1h97.74c-9.874 10.62 3.75-3.125-46.24 46.87l-147.6 49.12h98.24c-74.99 73.12-194.6 70.62-246.8 54.1l-66.14 65.99c-9.374 9.374-24.6 9.374-33.98 0s-9.374-24.6 0-33.98l259.5-259.2c6.249-6.25 6.249-16.37 0-22.62c-6.249-6.249-16.37-6.249-22.62 0l-178.4 178.2C58.78 306.1 68.61 216.7 129.1 156.3l85.74-85.68c90.62-90.62 189.8-88.27 252.3-25.78C517.8 95.34 528.9 169.7 483.4 244.2z"></path></svg>',
    action: (title, buttonId, content) =>
      `<span class="r-4qtqp9" style="min-width: 12px; min-height: 12px;"></span>
      <div class="css-175oi2r r-1awozwy r-1ets6dv r-5kkj8d r-18u37iz r-16y2uox r-1wtj0ep r-1e081e0 r-1f1sjgu">
        <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-1b43r93 r-1cwl3u0 r-16dba41" style="text-overflow: unset; color: rgb(15, 20, 25);">
          <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${title}</span>
        </div>
        <div id="${buttonId}" role="link" tabindex="0" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-15ysp7h r-4wgw6l r-ymttw5 r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" style="border-color: rgb(207, 217, 222); background-color: rgba(0, 0, 0, 0);">
          <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="text-overflow: unset; color: rgb(15, 20, 25);">
            <span class="css-1qaijid r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0" style="text-overflow: unset;">
              <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${content}</span>
            </span>
          </div>
        </div>
      </div>`,
    note: (title, content, logoHtml, actionHtml) =>
      `<div tabindex="0" class="css-175oi2r r-1ets6dv r-1867qdf r-rs99b7 r-1s2bzr4 r-1udh08x r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" data-testid="birdwatch-pivot" role="link">
      <div class="css-175oi2r r-k4xj1c r-1panhkp r-6koalj r-18u37iz r-1e081e0 r-1f1sjgu">
        <div class="css-175oi2r r-18u37iz r-13qz1uu">
          ${logoHtml}
          <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-1b43r93 r-1cwl3u0 r-b88u0q r-1awozwy r-6koalj r-1vvnge1 r-13qz1uu" style="text-overflow: unset; color: rgb(15, 20, 25);">
            <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${title}</span>
          </div>
        </div>
      </div>
      <span class="r-4qtqp9" style="min-width: 12px; min-height: 12px;"></span>
      <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1e081e0" style="text-overflow: unset; color: rgb(15, 20, 25);">
        <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;"><span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${content}</span></span>
      </div>
      ${actionHtml || '<br/>'}
    </div>`,
    dropdownNoteCreationButton: (logoHtml) =>
      `<a role="menuitem" class="css-175oi2r r-18u37iz r-ymttw5 r-1f1sjgu r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" data-testid="fc-note">
      <div class="css-175oi2r r-1777fci r-j2kj52">
        ${logoHtml}
      </div>
      <div class="css-175oi2r r-16y2uox r-1wbh5a2" id="createNoteButton">
        <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-b88u0q" style="text-overflow: unset; color: rgb(15, 20, 25);">
          <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3">Create Factchain Note</span>
        </div>
      </div>
    </div>`,
    mintXNoteOnDetailsPage: `<div class="css-175oi2r r-x572qd r-nsbfu8 r-1xfd6ze">
      <div class="css-175oi2r r-1awozwy r-18u37iz r-1wtj0ep">
        <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-b88u0q" style="text-overflow: unset; color: rgb(15, 20, 25);">
          <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Do you like this note?</span>
        </div>
        <div class="css-175oi2r r-18u37iz">
          <div id="mintNoteButton" role="button" tabindex="0" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-791edh r-id7aif r-15ysp7h r-4wgw6l r-ymttw5 r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l" style="background-color: rgba(0, 0, 0, 0); border-color: rgb(207, 217, 222);">
            <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="text-overflow: unset; color: rgb(29, 155, 240);">
              <span class="css-1qaijid r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0" style="text-overflow: unset;">
                <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Collect it on Factchain</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>`,
    mintXNoteOnMainPage: `<div class="css-175oi2r r-1awozwy r-1ets6dv r-5kkj8d r-18u37iz r-16y2uox r-1wtj0ep r-1e081e0 r-1f1sjgu r-ea455c">
      <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-1b43r93 r-1cwl3u0 r-16dba41" style="text-overflow: unset; color: rgb(15, 20, 25);">
        <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Do you like this note?</span>
      </div>
      <div role="link" tabindex="0" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-15ysp7h r-4wgw6l r-ymttw5 r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" style="border-color: rgb(207, 217, 222); background-color: rgba(0, 0, 0, 0);">
        <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="text-overflow: unset; color: rgb(15, 20, 25);">
          <span class="css-1qaijid r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0" style="text-overflow: unset;">
            <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Collect it on Factchain</span>
          </span>
        </div>
      </div>
    </div>`,
    approvedXNotes:
      "div[data-testid='birdwatch-pivot'].css-175oi2r.r-1ets6dv.r-1udh08x.r-x572qd.r-1mhqjh3.r-5kkj8d.r-1va55bh.r-1mnahxq.r-o7ynqc.r-6416eg.r-1ny4l3l.r-1loqt21",
  },
};
