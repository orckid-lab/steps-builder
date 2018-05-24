# steps-builder

<h3>Installation</h3>
<code>
    npm install https://github.com/mm-x/steps-builder
</code>

<h3>Usage</h3>
<p>Use the attribute sb-wrapper to the tag intended to contain all the steps. The value of the attribute should be a
    unique name.</p>
<pre><code>
    &lt;div sb-wrapper=&quot;wrapper-1&quot;&gt;
        // ... steps
        // ... navigation
    &lt;/div&gt;
</code></pre>
<p>Use the sb-number attribute to define the steps. If you are using bootstrap you may use the class "hide" to hide the steps by default.</p>
<pre><code>
    &lt;div sb-wrapper=&quot;wrapper-1&quot;&gt;
        &lt;div class=&quot;hide&quot; sb-number=&quot;1&quot;&gt;
            &lt;h2&gt;Step 1&lt;/h2&gt;
        &lt;/div&gt;
        &lt;div class=&quot;hide&quot; sb-number=&quot;2&quot;&gt;
            &lt;h2&gt;Step 2&lt;/h2&gt;
        &lt;/div&gt;
        ...
        // ... navigation
    &lt;/div&gt;
</code></pre>
<p>The following navigation buttons are supported: sb-previous, sb-next, sb-restart</p>
<pre><code>
    &lt;div sb-wrapper=&quot;wrapper-1&quot;&gt;
        &lt;div class=&quot;hide&quot; sb-number=&quot;1&quot;&gt;
            &lt;h2&gt;Step 1&lt;/h2&gt;
        &lt;/div&gt;
        &lt;div class=&quot;hide&quot; sb-number=&quot;2&quot;&gt;
            &lt;h2&gt;Step 2&lt;/h2&gt;
        &lt;/div&gt;
        ...
        &lt;div&gt;
            &lt;button type=&quot;button&quot; sb-restart&gt;Restart&lt;/button&gt;
            &lt;button type=&quot;button&quot; sb-previous&gt;Previous&lt;/button&gt;
            &lt;button type=&quot;button&quot; sb-next&gt;Next&lt;/button&gt;
            &lt;button type=&quot;submit&quot;&gt;Submit&lt;/button&gt;
        &lt;/div&gt;
    &lt;/div&gt;
</code></pre>