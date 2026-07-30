
(function(){
  const NAMES = [
  "Chinedu Okafor",
  "Aisha Bello",
  "Oluwaseun Adeyemi",
  "Emeka Nwosu",
  "Fatima Usman",
  "Ibrahim Musa",
  "Blessing Eze",
  "David Ojo",
  "Mercy Johnson",
  "Ahmed Sani",
  "Esther Okon",
  "Samuel Adewale",
  "Ngozi Obi",
  "Tunde Adebayo",
  "Zainab Garba",
  "Precious Uche"
];
 
  const COLORS = ["#F87171","#FBBF24","#34D399","#60A5FA","#A78BFA","#F472B6",
    "#38BDF8","#FB923C","#4ADE80","#C084FC","#F97316","#2DD4BF"];
 
  const TOP_COMMENTS = [
  "I just received my ₦25,000! Thank you Peller ❤️",
  "Just completed my application. Hoping to get the ₦25,000 instant cash 🙏",
  "My brother won ₦25,000 yesterday. This is real!",
  "Who else is applying for the ₦25,000 🔥",
  "I received my data bonus this morning. Thanks for this giveaway!",
  "Congratulations to Peller & Jarvis! Such a beautiful way to celebrate 🎉",
  "I have shared with all my WhatsApp groups. Waiting for approval now.",
  "I got the ₦25,000 reward. God bless you all!",
  "This giveaway is making so many Nigerians smile. ❤️",
  "Just finished my verification. Fingers crossed 🤞",
  "My friend received ₦25,000 today. I hope I'm next!",
  "Thank you Peller  for always supporting your fans across Nigeria.",
  "I can't believe this is happening. Applied successfully!",
  " users can apply too? I just submitted mine.",
  "Good luck everyone! Hope we all get selected."
];

const REPLIES = [
  "Congratulations! I just got mine too. 🎉",
  "Yes, it's available on Opay",
  "I received my reward after completing the verification.",
  "Same here! Wishing everyone good luck 🙏",
  "I got the package yesterday.",
  "I hope I get the ₦25,000 cash transfer 🤞",
  "Thanks for confirming. I'm applying now.",
  "I just shared to my WhatsApp groups too ",
  "Congratulations to Peller & Jarvis! ❤️",
  "This is one of the best fan giveaways this year.",
  "Can't wait to receive my reward. Good luck everyone! 🔥"
];
 
  // Expected image filenames — drop matching files into an "images/" folder
  // next to this page and they'll load automatically. Until then a clean
  // placeholder box is shown instead of a broken image icon.
  const COMMENT_IMAGE_SLOTS = [
    "comment1.png","comment2.png","comment3.png",
    "comment4.png","comment5.png","comment6.png"
  ];
 
  const commentsEl = document.getElementById('flcComments');
  const commentCountEl = document.getElementById('flcCommentCount');
  const typingStatusEl = document.getElementById('flcTypingStatus');
 
  let commentCount = 0;
  let commentStore = []; // newest first: {id, repliesEl}
  let idSeq = 1;
 
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function initials(name){ return name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase(); }
  function colorFor(name){
    let h = 0;
    for(let i=0;i<name.length;i++) h = name.charCodeAt(i) + ((h<<5)-h);
    return COLORS[Math.abs(h)%COLORS.length];
  }
  function slug(name){
    return name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }
 
  const PHOTO_ICON_SVG = '<svg viewBox="0 0 24 24" width="26" height="26" style="fill:#9AA0A6;"><path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>';
 
  // ---------- avatar (image with graceful fallback to initials), all inline ----------
  function buildAvatar(container, name, imgPath, size){
    container.innerHTML = '';
    container.style.width = size + 'px';
    container.style.height = size + 'px';
 
    const fallback = document.createElement('div');
    fallback.style.cssText = `position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:${Math.round(size*0.38)}px;background:${colorFor(name)};`;
    fallback.textContent = initials(name);
 
    const img = document.createElement('img');
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none;';
    img.alt = name;
    img.src = imgPath;
    img.onload = () => { img.style.display = 'block'; };
    img.onerror = () => { img.style.display = 'none'; };
 
    container.appendChild(fallback);
    container.appendChild(img);
  }
 
  function createAvatarEl(name, size){
    const wrap = document.createElement('div');
    wrap.style.cssText = `position:relative;width:${size}px;height:${size}px;border-radius:50%;flex-shrink:0;overflow:hidden;background:#fff;`;
    const path = (name === 'You' && userProfilePic) ? userProfilePic : `images/avatar-${slug(name)}.png`;
    buildAvatar(wrap, name, path, size);
    return wrap;
  }
 
  let userProfilePic = null; // set once the person picks their own photo
 
  const youAvatarEl = document.getElementById('flcYouAvatar');
  buildAvatar(youAvatarEl, 'You', 'images/you.jpg', 32);
 
  const editBadge = document.createElement('div');
  editBadge.style.cssText = 'position:absolute;bottom:-2px;right:-2px;width:16px;height:16px;border-radius:50%;background:#1B74E4;border:2px solid #fff;display:flex;align-items:center;justify-content:center;pointer-events:none;';
  editBadge.innerHTML = '<svg viewBox="0 0 24 24" width="8" height="8" style="fill:#fff;"><path d="M9 3l-1.8 2H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2h-3.2L15 3H9zm3 15a5 5 0 110-10 5 5 0 010 10z"/></svg>';
  youAvatarEl.appendChild(editBadge);
 
  const profilePicInput = document.getElementById('flcProfilePicInput');
  youAvatarEl.addEventListener('click', ()=> profilePicInput.click());
  profilePicInput.addEventListener('change', ()=>{
    const file = profilePicInput.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e)=>{
      userProfilePic = e.target.result;
      buildAvatar(youAvatarEl, 'You', userProfilePic, 32);
      youAvatarEl.appendChild(editBadge);
    };
    reader.readAsDataURL(file);
  });
 
  // ---------- comment image (real file with graceful placeholder), all inline ----------
  function createCommentImage(path){
    const wrap = document.createElement('div');
    wrap.className = 'flc-comment-image';
    wrap.style.cssText = 'margin-top:6px;border-radius:12px;overflow:hidden;max-width:min(260px,100%);border:1px solid #E4E6EB;';
    const img = document.createElement('img');
    img.style.cssText = 'display:block;width:100%;max-height:220px;object-fit:cover;';
    img.alt = 'Comment image';
    img.loading = 'lazy';
    img.src = path;
    img.onload = () => {
      wrap.style.background = '';
    };
    img.onerror = () => {
      wrap.style.cssText = 'margin-top:6px;border-radius:12px;overflow:hidden;max-width:min(260px,100%);border:1px solid #E4E6EB;background:#E9EBEE;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:22px 12px;';
      wrap.innerHTML = PHOTO_ICON_SVG + `<span style="font-size:11px;color:#9AA0A6;text-align:center;word-break:break-all;">${path}</span>`;
    };
    wrap.appendChild(img);
    return wrap;
  }
 
  function createCommentImageFromDataUrl(dataUrl){
    const wrap = document.createElement('div');
    wrap.className = 'flc-comment-image';
    wrap.style.cssText = 'margin-top:6px;border-radius:12px;overflow:hidden;max-width:min(260px,100%);border:1px solid #E4E6EB;';
    const img = document.createElement('img');
    img.style.cssText = 'display:block;width:100%;max-height:220px;object-fit:cover;';
    img.alt = 'Attached image';
    img.src = dataUrl;
    wrap.appendChild(img);
    return wrap;
  }
 
  function isNearTop(){ return commentsEl.scrollTop < 80; }
  function scrollToTop(){ commentsEl.scrollTop = 0; }
  function bumpCount(){ commentCount++; commentCountEl.textContent = commentCount; }
 
  function likeBurst(wrapEl){
    const heart = document.createElement('span');
    heart.style.cssText = 'position:absolute;left:2px;top:-4px;pointer-events:none;font-size:14px;animation:flcHeartUp .7s ease forwards;';
    heart.textContent = '❤️';
    wrapEl.appendChild(heart);
    setTimeout(()=>heart.remove(), 700);
  }
 
  function makeActions(isReply, likeSeed){
    const wrap = document.createElement('div');
    wrap.className = 'flc-actions';
    wrap.style.cssText = 'display:inline-flex;flex-wrap:nowrap;white-space:nowrap;gap:8px;align-items:center;margin:0 2px 0 10px;font-size:12.5px;color:#65676B;max-width:100%;';
    let liked = false;
    let count = likeSeed;
 
    const likeWrap = document.createElement('span');
    likeWrap.style.cssText = 'position:relative;display:inline-flex;';
    const likeBtn = document.createElement('button');
    likeBtn.type = 'button';
    likeBtn.textContent = 'Like';
    likeBtn.style.cssText = 'background:none;border:none;padding:4px 2px;margin:-4px -2px;font-size:12.5px;font-weight:600;color:#65676B;cursor:pointer;font-family:inherit;';
    likeWrap.appendChild(likeBtn);
    likeBtn.addEventListener('click', ()=>{
      liked = !liked;
      count += liked ? 1 : -1;
      likeBtn.style.color = liked ? '#F33E58' : '#65676B';
      countSpan.textContent = count > 0 ? count : '';
      if(liked) likeBurst(likeWrap);
    });
 
    const countSpan = document.createElement('span');
    countSpan.style.cssText = 'font-weight:400;color:#65676B;';
    countSpan.textContent = count > 0 ? count : '';
 
    const replyBtn = document.createElement('button');
    replyBtn.type = 'button';
    replyBtn.textContent = 'Reply';
    replyBtn.style.cssText = 'background:none;border:none;padding:4px 2px;margin:-4px -2px;font-size:12.5px;font-weight:600;color:#65676B;cursor:pointer;font-family:inherit;';
 
    const dotStyle = 'opacity:.6;';
    const dot1 = document.createElement('span'); dot1.style.cssText = dotStyle; dot1.textContent='·';
    const time = document.createElement('span');
    time.textContent = 'Just now';
 
    wrap.appendChild(likeWrap);
    wrap.appendChild(countSpan);
    if(!isReply){
      wrap.appendChild(dot1);
      wrap.appendChild(replyBtn);
    }
    const dot2 = document.createElement('span'); dot2.style.cssText = dotStyle; dot2.textContent='·';
    wrap.appendChild(dot2);
    wrap.appendChild(time);
 
    return { wrap, replyBtn };
  }
 
  function createCommentRow(name, text, isReply, imagePathOrDataUrl, isDataUrl){
    const row = document.createElement('div');
    row.className = isReply ? 'flc-comment-row flc-reply-row' : 'flc-comment-row';
    row.style.cssText = `display:flex;gap:8px;margin:10px 0;animation:flcPop .32s cubic-bezier(.2,.9,.3,1.3);`;
 
    const avatar = createAvatarEl(name, isReply ? 28 : 34);
 
    const col = document.createElement('div');
    col.className = 'flc-bubble-col';
    col.style.cssText = 'flex:1;min-width:0;';
 
    const bubble = document.createElement('div');
    bubble.style.cssText = 'background:#F0F2F5;border-radius:16px;padding:8px 12px 6px;display:inline-block;max-width:100%;box-sizing:border-box;';
    const nameEl = document.createElement('span');
    nameEl.style.cssText = 'font-weight:600;font-size:13.5px;display:block;margin-bottom:1px;';
    nameEl.textContent = name;
    const textEl = document.createElement('span');
    textEl.style.cssText = 'font-size:14.5px;line-height:1.35;color:#050505;word-wrap:break-word;overflow-wrap:anywhere;';
    textEl.textContent = text;
    bubble.appendChild(nameEl);
    bubble.appendChild(textEl);
 
    const likeSeed = isReply ? Math.floor(Math.random()*6) : Math.floor(Math.random()*30);
    const { wrap: actions, replyBtn } = makeActions(isReply, likeSeed);
 
    col.appendChild(bubble);
 
    if(imagePathOrDataUrl){
      const imgEl = isDataUrl
        ? createCommentImageFromDataUrl(imagePathOrDataUrl)
        : createCommentImage(imagePathOrDataUrl);
      col.appendChild(imgEl);
    }
 
    col.appendChild(actions);
 
    let repliesEl = null;
    let replyComposerShown = false;
 
    if(!isReply){
      repliesEl = document.createElement('div');
      repliesEl.className = 'flc-replies';
      repliesEl.style.cssText = 'margin-left:clamp(8px,4vw,16px);padding-left:clamp(6px,3vw,14px);border-left:2px solid #E4E6EB;margin-top:6px;display:none;';
      col.appendChild(repliesEl);
 
      replyBtn.addEventListener('click', ()=>{
        if(replyComposerShown){
          const existing = col.querySelector('.flc-reply-composer');
          if(existing) existing.remove();
          replyComposerShown = false;
          return;
        }
        replyComposerShown = true;
        repliesEl.style.display = 'block';
        const rc = document.createElement('div');
        rc.className = 'flc-reply-composer';
        rc.style.cssText = 'margin:6px 0 0 12px;display:flex;gap:8px;';
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Reply to ${name}…`;
        input.maxLength = 150;
        input.style.cssText = 'flex:1;min-width:0;border:none;background:#F0F2F5;border-radius:16px;padding:6px 12px;font-size:16px;font-family:inherit;outline:none;box-sizing:border-box;';
        const send = document.createElement('button');
        send.type = 'button';
        send.textContent = 'Post';
        send.style.cssText = 'border:none;background:none;color:#1B74E4;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;padding:4px 6px;';
        rc.appendChild(input);
        rc.appendChild(send);
        col.insertBefore(rc, repliesEl);
        input.focus();
 
        function submitReply(){
          const val = input.value.trim();
          if(!val) return;
          const r = createCommentRow('You', val, true);
          repliesEl.appendChild(r.row);
          repliesEl.style.display = 'block';
          bumpCount();
          rc.remove();
          replyComposerShown = false;
        }
        send.addEventListener('click', submitReply);
        input.addEventListener('keydown', e=>{ if(e.key==='Enter') submitReply(); });
      });
    }
 
    row.appendChild(avatar);
    row.appendChild(col);
 
    return { row, repliesEl };
  }
 
  function maybeCommentImagePath(){
    return Math.random() < 0.28 ? pick(COMMENT_IMAGE_SLOTS) : null;
  }
 
  function appendTopLevel(name, text, imagePath){
    const { row, repliesEl } = createCommentRow(name, text, false, imagePath, false);
    commentsEl.prepend(row);
    bumpCount();
    const id = idSeq++;
    commentStore.unshift({ id, repliesEl });
    if(commentStore.length > 40) commentStore.pop();
    if(isNearTop()) scrollToTop();
    return id;
  }
 
  function appendReply(repliesEl, name, text, imagePath, isDataUrl){
    repliesEl.style.display = 'block';
    const { row } = createCommentRow(name, text, true, imagePath, isDataUrl);
    repliesEl.appendChild(row);
    bumpCount();
    if(isNearTop()) scrollToTop();
  }
 
  // typing indicator
  function showTyping(name){
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;margin:10px 0;align-items:flex-end;animation:flcPop .25s ease;';
    const avatar = createAvatarEl(name, 34);
    const bubble = document.createElement('div');
    bubble.style.cssText = 'background:#F0F2F5;border-radius:16px;padding:10px 14px;display:inline-flex;align-items:center;gap:4px;';
    [0,1,2].forEach(i=>{
      const dot = document.createElement('span');
      dot.style.cssText = `width:6px;height:6px;border-radius:50%;background:#8A8D91;animation:flcBounce 1.1s infinite ease-in-out;animation-delay:${i*0.15}s;display:inline-block;`;
      bubble.appendChild(dot);
    });
    row.appendChild(avatar);
    row.appendChild(bubble);
    commentsEl.prepend(row);
    if(isNearTop()) scrollToTop();
    typingStatusEl.textContent = `${name} is typing…`;
    return row;
  }
  function hideTyping(row){
    row.remove();
    typingStatusEl.textContent = '';
  }
 
  function seedInitialComments(){
    const seed = [
      ["Amara Chen", pick(TOP_COMMENTS), [["Diego Ruiz", pick(REPLIES)]]],
      ["Kwame Asante", pick(TOP_COMMENTS), []],
      ["Lena Fischer", pick(TOP_COMMENTS), [["Sofia Rossi", pick(REPLIES)], ["Yuki Tanaka", pick(REPLIES)]]],
    ];
    seed.slice().reverse().forEach(([name, text, replies])=>{
      const id = appendTopLevel(name, text, maybeCommentImagePath());
      const entry = commentStore.find(c=>c.id===id);
      replies.forEach(([rn, rt])=> appendReply(entry.repliesEl, rn, rt));
    });
    scrollToTop();
  }
 
  function simulateOne(){
    const asReply = commentStore.length > 0 && Math.random() < 0.35;
    const name = pick(NAMES);
 
    const typingRow = showTyping(name);
    const delay = 900 + Math.random()*1400;
 
    setTimeout(()=>{
      hideTyping(typingRow);
 
      if(asReply){
        const topThree = commentStore.slice(0, Math.min(3, commentStore.length));
        const target = pick(topThree);
        appendReply(target.repliesEl, name, pick(REPLIES));
        maybeChainReplies(target);
      } else {
        const text = pick(TOP_COMMENTS);
        const id = appendTopLevel(name, text, maybeCommentImagePath());
        const entry = commentStore.find(c=>c.id===id);
        if(Math.random() < 0.45){
          maybeChainReplies(entry);
        }
      }
    }, delay);
  }
 
  function maybeChainReplies(entry){
    const n = 1 + Math.floor(Math.random()*3); // 1-3 replies
    let i = 0;
    function next(){
      if(i>=n) return;
      i++;
      const name = pick(NAMES);
      const trow = showTyping(name);
      const d = 800 + Math.random()*1200;
      setTimeout(()=>{
        hideTyping(trow);
        appendReply(entry.repliesEl, name, pick(REPLIES));
        setTimeout(next, 600 + Math.random()*900);
      }, d);
    }
    setTimeout(next, 400);
  }
 
  // ---------- post-level like / comment / share bar ----------
  const likeTotalEl = document.getElementById('flcLikeTotal');
  const shareCountEl = document.getElementById('flcShareCount');
  const postLikeBtn = document.getElementById('flcPostLikeBtn');
  const postCommentBtn = document.getElementById('flcPostCommentBtn');
  const postShareBtn = document.getElementById('flcPostShareBtn');
 
  let likeTotal = 341;
  let shareTotal = 18;
  let postLiked = false;
 
  function renderLikeTotal(){ likeTotalEl.textContent = likeTotal.toLocaleString(); }
  function renderShareTotal(){ shareCountEl.textContent = `${shareTotal.toLocaleString()} shares`; }
  renderLikeTotal();
  renderShareTotal();
 
  postLikeBtn.addEventListener('click', ()=>{
    postLiked = !postLiked;
    likeTotal += postLiked ? 1 : -1;
    postLikeBtn.style.color = postLiked ? '#1B74E4' : '#65676B';
    renderLikeTotal();
  });
 
  postCommentBtn.addEventListener('click', ()=>{
    document.getElementById('flcComposerInput').focus();
  });
 
  postShareBtn.addEventListener('click', ()=>{
    shareTotal += 1;
    renderShareTotal();
  });
 
  // ambient: likes/shares tick up slowly on their own, like a real live post
  setInterval(()=>{
    if(Math.random() < 0.6){ likeTotal += 1; renderLikeTotal(); }
  }, 5000 + Math.random()*4000);
  setInterval(()=>{
    if(Math.random() < 0.3){ shareTotal += 1; renderShareTotal(); }
  }, 9000 + Math.random()*6000);
 
  function loop(){
    simulateOne();
    const next = 3000 + Math.random()*700;
    setTimeout(loop, next);
  }
 
  // ---------- composer + real image attach ----------
  const attachBtn = document.getElementById('flcAttachBtn');
  const fileInput = document.getElementById('flcFileInput');
  const attachPreview = document.getElementById('flcAttachPreview');
  const attachImg = document.getElementById('flcAttachImg');
  const attachRemove = document.getElementById('flcAttachRemove');
  let pendingImageDataUrl = null;
 
  attachBtn.addEventListener('click', ()=> fileInput.click());
 
  fileInput.addEventListener('change', ()=>{
    const file = fileInput.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e)=>{
      pendingImageDataUrl = e.target.result;
      attachImg.src = pendingImageDataUrl;
      attachPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });
 
  attachRemove.addEventListener('click', ()=>{
    pendingImageDataUrl = null;
    fileInput.value = '';
    attachPreview.style.display = 'none';
  });
 
  document.getElementById('flcComposerForm').addEventListener('submit', function(e){
    e.preventDefault();
    const input = document.getElementById('flcComposerInput');
    const val = input.value.trim();
    if(!val && !pendingImageDataUrl) return;
 
    const id = appendTopLevel('You', val || ' ', pendingImageDataUrl);
    if(pendingImageDataUrl){
      const row = commentsEl.firstElementChild;
      const existingImg = row.querySelector('.flc-comment-image');
      if(existingImg) existingImg.remove();
      row.querySelector('.flc-bubble-col').insertBefore(
        createCommentImageFromDataUrl(pendingImageDataUrl),
        row.querySelector('.flc-actions')
      );
    }
 
    input.value = '';
    pendingImageDataUrl = null;
    fileInput.value = '';
    attachPreview.style.display = 'none';
    scrollToTop();
 
    if(Math.random() < 0.5){
      const entry = commentStore.find(c=>c.id===id);
      setTimeout(()=> maybeChainReplies(entry), 1500 + Math.random()*1500);
    }
  });
 
  seedInitialComments();
  setTimeout(loop, 2000);
})();
