<script>
  import { onMount } from 'svelte';
  import { addPost, readPost } from "../db";
  import { auth } from "../login";

  let posts = [];
  let loading = false;
  let errorMessage = '';
  let showForm = false;

  // Form fields
  let title = '';
  let description = '';
  let division = '';
  let district = '';
  let imageUrl = '';
  let videoUrl = '';
  let crimeTime = '';

  onMount(async () => {
    await loadPosts();
  });

  async function loadPosts() {
    loading = true;
    const result = await readPost();
    if (result.success) {
      posts = result.posts;
    } else {
      errorMessage = result.error;
    }
    loading = false;
  }

  async function handleAddPost() {
    if (!title || !description || !division || !district || !crimeTime) {
      errorMessage = 'Please fill in all required fields';
      return;
    }

    errorMessage = '';
    
    const upvotes = 0;
    const downvotes = 0;
    const verificationScore = upvotes + downvotes > 0 ? upvotes / (upvotes + downvotes) : 0;
    
    const post = {
      title,
      description,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
      division,
      district,
      postedAt: new Date().toISOString(),
      crimeTime: new Date(crimeTime).toISOString(),
      reporterId: auth.currentUser?.uid || 'anonymous',
      upvotes,
      downvotes,
      verificationScore,
      comments: []
    };

    const result = await addPost(post);
    if (result.success) {
      // Clear form
      title = '';
      description = '';
      division = '';
      district = '';
      imageUrl = '';
      videoUrl = '';
      crimeTime = '';
      showForm = false;
      
      // Reload posts
      await loadPosts();
    } else {
      errorMessage = result.error;
    }
  }
</script>

<main>
  <div class="container">
    <h2>Community Reports</h2>
    
    <button on:click={() => showForm = !showForm} class="toggle-btn">
      {showForm ? 'Cancel' : 'Create New Report'}
    </button>

    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}

    {#if showForm}
      <div class="form-container">
        <h3>Submit a Report</h3>
        <form on:submit|preventDefault={handleAddPost}>
          <label for="title">Title *</label>
          <input type="text" id="title" bind:value={title} required>

          <label for="description">Description *</label>
          <textarea id="description" bind:value={description} rows="4" required></textarea>

          <label for="division">Division *</label>
          <input type="text" id="division" bind:value={division} required>

          <label for="district">District *</label>
          <input type="text" id="district" bind:value={district} required>

          <label for="crimeTime">When did the incident occur? *</label>
          <input type="datetime-local" id="crimeTime" bind:value={crimeTime} required>

          <label for="imageUrl">Image URL (optional)</label>
          <input type="text" id="imageUrl" bind:value={imageUrl} placeholder="">

          <label for="videoUrl">Video URL (optional)</label>
          <input type="text" id="videoUrl" bind:value={videoUrl} placeholder="">

          <button type="submit" class="submit-btn">Submit Report</button>
        </form>
      </div>
    {/if}

    <div class="posts-container">
      <h3>Recent Reports</h3>
      
      {#if loading}
        <p>Loading posts...</p>
      {:else if posts.length === 0}
        <p>No reports yet. Be the first to submit one!</p>
      {:else}
        {#each posts as post}
          <div class="post-card">
            <h4>{post.title}</h4>
            <p class="description">{post.description}</p>
            <div class="post-meta">
              <span>📍 {post.division}, {post.district}</span>
              <span>👍 {post.upvotes} 👎 {post.downvotes}</span>
              <span>✓ {(post.verificationScore * 100).toFixed(0)}%</span>
            </div>
            {#if post.imageUrl}
              <p class="media-link">🖼️ Image attached</p>
            {/if}
            {#if post.videoUrl}
              <p class="media-link">🎥 Video attached</p>
            {/if}
            <p class="timestamp">Incident: {new Date(post.crimeTime).toLocaleString()}</p>
            <p class="timestamp">Posted: {new Date(post.postedAt).toLocaleString()}</p>
            <p class="reporter-id">Reporter: {post.reporterId}</p>
            {#if post.comments && post.comments.length > 0}
              <div class="comments">
                <h5>Comments ({post.comments.length})</h5>
                {#each post.comments as comment}
                  <div class="comment">
                    <p>{comment.text}</p>
                    <span class="comment-meta">- {comment.userId} at {new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  </div>
</main>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .toggle-btn {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 20px;
  }

  .toggle-btn:hover {
    background-color: #45a049;
  }

  .error {
    color: red;
    padding: 10px;
    background-color: #ffe6e6;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .form-container {
    background-color: #060606;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  label {
    font-weight: bold;
    margin-top: 10px;
  }

  input, textarea {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }

  .submit-btn {
    background-color: #2196F3;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    font-size: 16px;
  }

  .submit-btn:hover {
    background-color: #0b7dda;
  }

  .posts-container {
    margin-top: 30px;
  }

  .post-card {
    background-color: rgb(0, 0, 0);
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .post-card h4 {
    margin-top: 0;
    color: #ffd0d0
  }

  .description {
    color: #ffffff;
    line-height: 1.5;
  }

  .post-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #eee;
    font-size: 14px;
    color: #ffd5d5;
  }

  .media-link {
    font-size: 14px;
    color: #2196F3;
    margin: 5px 0;
  }

  .timestamp {
    font-size: 12px;
    color: #ff5757;
    margin: 5px 0;
  }

  .reporter-id {
    font-size: 12px;
    color: #999;
    margin: 5px 0;
  }

  .comments {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #333;
  }

  .comments h5 {
    color: #ffd0d0;
    margin-bottom: 10px;
  }

  .comment {
    background-color: #1a1a1a;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .comment p {
    color: #ffffff;
    margin: 0 0 5px 0;
  }

  .comment-meta {
    font-size: 11px;
    color: #888;
  }
</style>
