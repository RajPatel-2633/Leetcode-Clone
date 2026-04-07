import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";
import {Navigate, useNavigate} from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
});

// Sample problem data for pre-filling the form
// Sample problem data for pre-filling the form
const sampledpData = {
  title: "Climbing Stairs",
  category: "dp", // Dynamic Programming
  description:
    "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization"],
  constraints: "1 <= n <= 45",
  hints:
    "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial:
    "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
  testCases: [
    {
      input: "2",
      output: "2",
    },
    {
      input: "3",
      output: "3",
    },
    {
      input: "4",
      output: "5",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: "n = 2",
      output: "2",
      explanation:
        "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
    },
    PYTHON: {
      input: "n = 3",
      output: "3",
      explanation:
        "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
    },
    JAVA: {
      input: "n = 4",
      output: "5",
      explanation:
        "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Write your code here
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Write your code here
      return 0;
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Base cases
if (n <= 2) {
  return n;
}

// Dynamic programming approach
let dp = new Array(n + 1);
dp[1] = 1;
dp[2] = 2;

for (let i = 3; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
}

return dp[n];

/* Alternative approach with O(1) space
let a = 1; // ways to climb 1 step
let b = 2; // ways to climb 2 steps

for (let i = 3; i <= n; i++) {
  let temp = a + b;
  a = b;
  b = temp;
}

return n === 1 ? a : b;
*/
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Base cases
      if n <= 2:
          return n
      
      # Dynamic programming approach
      dp = [0] * (n + 1)
      dp[1] = 1
      dp[2] = 2
      
      for i in range(3, n + 1):
          dp[i] = dp[i - 1] + dp[i - 2]
      
      return dp[n]
      
      # Alternative approach with O(1) space
      # a, b = 1, 2
      # 
      # for i in range(3, n + 1):
      #     a, b = b, a + b
      # 
      # return a if n == 1 else b

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Base cases
      if (n <= 2) {
          return n;
      }
      
      // Dynamic programming approach
      int[] dp = new int[n + 1];
      dp[1] = 1;
      dp[2] = 2;
      
      for (int i = 3; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
      }
      
      return dp[n];
      
      /* Alternative approach with O(1) space
      int a = 1; // ways to climb 1 step
      int b = 2; // ways to climb 2 steps
      
      for (int i = 3; i <= n; i++) {
          int temp = a + b;
          a = b;
          b = temp;
      }
      
      return n == 1 ? a : b;
      */
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
  },
};

// Sample problem data for another type of question
const sampleStringProblem = {
  title: "Valid Palindrome",
  description:
    "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
  difficulty: "EASY",
  tags: ["String", "Two Pointers"],
  constraints:
    "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
  hints:
    "Consider using two pointers, one from the start and one from the end, moving towards the center.",
  editorial:
    "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
  testCases: [
    {
      input: "A man, a plan, a canal: Panama",
      output: "true",
    },
    {
      input: "race a car",
      output: "false",
    },
    {
      input: " ",
      output: "true",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    PYTHON: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    JAVA: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Write your code here
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Write your code here
          pass
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
       
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Convert to lowercase and remove non-alphanumeric characters
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if it's a palindrome
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
      if (s[left] !== s[right]) {
        return false;
      }
      left++;
      right--;
    }
    
    return true;
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Convert to lowercase and keep only alphanumeric characters
          filtered_chars = [c.lower() for c in s if c.isalnum()]
          
          # Check if it's a palindrome
          return filtered_chars == filtered_chars[::-1]
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        s = preprocess(s);
        int left = 0, right = s.length() - 1;

        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }

        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
  },
};

const CreateProblemForm = () => {
  const [sampleType, setSampleType] = useState("DP"); // Default to array problem
const navigation = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      testCases: [{ input: "", output: "" }],
      tags: [""],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
    },
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replaceTestCases,
  } = useFieldArray({
    control,
    name: "testCases",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (value) => {
    try {
      // stringify the data
      setIsLoading(true);
      const res = await axiosInstance.post("/problems/create-problem", value);
      
      console.log(res.data);
      toast.success(res.data.message);
      
      // Refresh problems list before navigating
      console.log("Calling refreshProblems");
      await useProblemStore.getState().refreshProblems();
      
      navigation("/");
    } catch (error) {
      console.log("Error creating problem", error);
      toast.error("Error creating problem");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load sample data
  const loadSampleData = () => {
    const sampleData =
      sampleType === "DP" ? sampledpData : sampleStringProblem;

    // Replace the tags and test cases arrays
    replaceTags(sampleData.tags.map((tag) => tag));
    replaceTestCases(sampleData.testCases.map((tc) => tc));

    // Reset the form with sample data
    reset(sampleData);
  };

  return (
    <div className="w-full space-y-12 pb-20">
      {/* 1. Header & Utility Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--p),0.2)]">
            <FileText size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black uppercase font-display tracking-tight text-white leading-none">
              Initialize_Module
            </h2>
            <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em] mt-2">
              Sector: Database_Input // New_Record
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex gap-1 backdrop-blur-md">
            {["DP", "STRING"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSampleType(type.toLowerCase() === "dp" ? "array" : "string")}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  sampleType === (type.toLowerCase() === "dp" ? "array" : "string") 
                    ? "bg-primary text-black shadow-[0_0_15px_rgba(var(--p),0.4)]" 
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {type}_Template
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={loadSampleData}
            className="flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Download size={14} className="text-primary" />
            Load_Buffer
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
        
        {/* SECTION A: IDENTITY & PARAMETERS */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="h-px w-10 bg-primary" />
             <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Sector_01: Identity_Manifest</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 ml-2">Module_Title</label>
              <input
                type="text"
                {...register("title")}
                className={`w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl p-5 focus:border-primary/50 outline-none transition-all font-bold font-mono text-sm ${errors.title ? "border-rose-500/50" : ""}`}
                placeholder="INPUT_TITLE_HERE..."
              />
              {errors.title && <p className="text-rose-500 text-[10px] font-black mt-1 ml-2 uppercase tracking-tighter">{errors.title.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 ml-2">Difficulty_Rating</label>
              <select
                {...register("difficulty")}
                className="w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl p-5 focus:border-primary/50 outline-none appearance-none font-black text-primary font-mono tracking-widest"
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>

            <div className="md:col-span-3 space-y-3">
              <label className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 ml-2">Description_Payload</label>
              <textarea
                {...register("description")}
                className="w-full bg-white/[0.03] border-2 border-white/5 rounded-[2rem] p-8 focus:border-primary/50 outline-none min-h-[250px] resize-none font-medium leading-relaxed transition-all"
                placeholder="LOAD_DESCRIPTION_LOGIC..."
              />
            </div>
          </div>
        </div>

        {/* SECTION B: CLASSIFICATION (TAGS) */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="h-px w-10 bg-blue-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Sector_02: Classification</h3>
            </div>
            <button
              type="button"
              onClick={() => appendTag("")}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors"
            >
              [ + Add_Tag ]
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tagFields.map((field, index) => (
              <motion.div 
                key={field.id} 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <input
                  type="text"
                  {...register(`tags.${index}`)}
                  className="w-full bg-white/[0.03] border-2 border-white/5 rounded-xl py-3 px-4 text-[10px] font-black uppercase tracking-widest focus:border-primary/50 outline-none transition-all pr-10"
                  placeholder="TAG_ID"
                />
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  disabled={tagFields.length === 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION C: VALIDATION (TEST CASES) */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="h-px w-10 bg-emerald-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Sector_03: Validation_Nodes</h3>
            </div>
            <button
              type="button"
              onClick={() => appendTestCase({ input: "", output: "" })}
              className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
            >
              <Plus size={14} /> New_Validation_Node
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {testCaseFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-black/40 border-2 border-white/5 rounded-[2rem] p-8 space-y-6 relative overflow-hidden group hover:border-emerald-500/20 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-600">NODE_{index + 1} // BUFFER</span>
                    <button type="button" onClick={() => removeTestCase(index)} disabled={testCaseFields.length === 1} className="text-slate-600 hover:text-rose-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest ml-1">Input_Stream</label>
                        <textarea {...register(`testCases.${index}.input`)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono outline-none focus:border-blue-500/50 min-h-[100px] resize-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest ml-1">Expected_Return</label>
                        <textarea {...register(`testCases.${index}.output`)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono outline-none focus:border-emerald-500/50 min-h-[100px] resize-none" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* SECTION D: SOURCE TEMPLATES (JAVASCRIPT, PYTHON, JAVA) */}
        {/* Note: Ensure language names match the style of headers */}
        <div className="space-y-10">
          <div className="flex items-center gap-4">
             <div className="h-px w-10 bg-purple-500" />
             <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Sector_04: Source_Templates</h3>
          </div>

          <div className="space-y-16">
            {["JAVASCRIPT", "PYTHON", "JAVA"].map((language) => (
              <div key={language} className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="bg-black/60 px-10 py-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Code2 className="text-primary" size={20} />
                    <span className="font-display font-black uppercase tracking-tight text-2xl text-white">{language}</span>
                  </div>
                  <div className="px-4 py-1.5 rounded-full border border-white/10 text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest">
                    Source_Template_Type: {language}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Starter Code */}
                  <div className="p-10 border-r border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                          <Terminal size={14}/> Starter_Code
                        </h4>
                    </div>
                    <div className="border-2 border-white/5 rounded-3xl overflow-hidden h-[350px] shadow-inner">
                      <Controller
                        name={`codeSnippets.${language}`}
                        control={control}
                        render={({ field }) => (
                          <Editor
                            height="100%"
                            language={language.toLowerCase()}
                            theme="vs-dark"
                            value={field.value}
                            onChange={field.onChange}
                            options={{ minimap: { enabled: false }, fontSize: 13, padding: {top: 20}, fontFamily: 'JetBrains Mono' }}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Reference Solution */}
                  <div className="p-10 space-y-6 bg-primary/[0.02]">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                      <CheckCircle2 size={14}/> Reference_Solution
                    </h4>
                    <div className="border-2 border-primary/10 rounded-3xl overflow-hidden h-[350px]">
                      <Controller
                        name={`referenceSolutions.${language}`}
                        control={control}
                        render={({ field }) => (
                          <Editor
                            height="100%"
                            language={language.toLowerCase()}
                            theme="vs-dark"
                            value={field.value}
                            onChange={field.onChange}
                            options={{ minimap: { enabled: false }, fontSize: 13, padding: {top: 20}, fontFamily: 'JetBrains Mono' }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL SUBMIT BUTTON */}
        <div className="flex justify-end pt-12 border-t border-white/5">
          <button 
            type="submit" 
            disabled={isLoading}
            className="group relative px-16 py-6 bg-primary text-black font-black uppercase tracking-tight rounded-[2rem] shadow-[0_0_40px_rgba(var(--p),0.4)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 font-display text-xl flex items-center gap-4"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (
              <>
                Finalize_Injection
                <CheckCircle2 size={24} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProblemForm;